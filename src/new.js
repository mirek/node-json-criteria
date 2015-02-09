
import { resolve } from 'rus-diff'

function isvalue (a) {
  return a !== undefined && a !== null
}

function* kvs (a) {
  for (let k of Object.keys(a)) {
    if (a.hasOwnProperty(k)) {
      yield [k, a[k]]
    }
  }
}

function isdeep (a, b) {
  var as, bs, i, k, sf, v, _i, _len, _ref;
  if ((a !== null) && (b !== null) && (typeof a === 'object') && (typeof b === 'object')) {
    as = (function() {
      var _results;
      _results = [];
      for (k in a) {
        if (!__hasProp.call(a, k)) continue;
        v = a[k];
        _results.push({
          k: k,
          v: v
        });
      }
      return _results;
    })();
    bs = (function() {
      var _results;
      _results = [];
      for (k in b) {
        if (!__hasProp.call(b, k)) continue;
        v = b[k];
        _results.push({
          k: k,
          v: v
        });
      }
      return _results;
    })();
    if (as.length === bs.length) {
      sf = function(x, y) {
        return x.k > y.k;
      };
      as.sort(sf);
      bs.sort(sf);
      for (i = _i = 0, _len = as.length; _i < _len; i = ++_i) {
        _ref = as[i], k = _ref.k, v = _ref.v;
        if (!(isdeep(k, bs[i].k) && isdeep(v, bs[i].v))) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  } else {
    return a === b;
  }
}

class Criteria {

  constructor () {
    this.registry = {
      transforms: [],
      conditions: [],
      expansions: []
    }
  }

  append (t, k, f) {
    this.registry[t].push([ k, f ])
  }

  prepend (t, k, f) {
    this.registry[t].shift([ k, f ])
  }

  // Find rule with k name.
  rule (k) {
    let r = [ undefined, undefined ]
    for (let [ tk, tv ] of kvs(this.registry)) {
      for (let [ rk, rf ] of tv) {
        if (k === rk) {
          r = [ tk, rf ]
          break;
        }
      }
    }
    return r
  }

  test (d, q) {
    let r = true
    for (let [ qk, qv ] of kvs(q)) {
      if (qk[0] === '$') {

        let [ t, f ] = this.rule(qk)

        switch (t) {
          case 'expansions': r = r && this.test(d, f); break
          case 'transforms': r = r && this.test(f.bind(this)(d, qv), qv); break
          case 'conditions': r = r && f.bind(this)(d, qv, q); break
          default: throw new Error(`Unknown rule ${qk}`)
        }

        if (r === false) {
          break
        }
      } else {
        let tqk = qk[0] === ' ' ? qk.slice(1) : qk // trim ' $foo' leading space
        let [ dvp, dk ] = resolve(d, tqk) || []
        if (dvp !== null && dk.length === 1) { // ...it's resolved
          r = r && this.test(dvp[dk[0]], qv)
        } else {
          r = r && this.test(undefined, v) // we can still match `{ $exists: false }`, possibly in nested `{ $or: [] }`.
        }
      }
    }
    return r
  }
}

let c = new Criteria()

// Comparision

c.append('conditions', '$eq', (a, b) => isdeep(a, b) )
c.append('conditions', '$gt', (a, b) => a > b )
c.append('conditions', '$gte', (a, b) => a > b )
c.append('conditions', '$lt', (a, b) => a < b )
c.append('conditions', '$lte', (a, b) => a <= b )
c.append('conditions', '$ne', (a, b) => !isdeep(a, b) )
c.append('conditions', '$in', (a, b) => { let aa = arrize(a); arrize(b).some((e) => e in aa) } )
c.append('conditions', '$nin', (a, b) => { let aa = arrize(a); arrize(b).every((e) => !(e in aa)) } )

// Logical

c.append('conditions', '$or', (a) => { return a.reduce(((p, c) => p || this.test(a, c)), false) })
c.append('conditions', '$and', (a) => { return a.reduce(((p, c) => p && this.test(a, c)), true) })
c.append('conditions', '$not', (a) => { return !this.test(a, c) })
c.append('conditions', '$nor', (a) => { return a.reduce(((p, c) => p && !this.test(a, c)), true) })

// Element

c.append('conditions', '$exists', (a, b) => a ^ isvalue(b) )
c.append('conditions', '$typeof', (a, b) => typeof(a) === b ) // MongoDB discrepancy

// Evaluation

c.append('conditions', '$mod', (a, b) => (a % b[0]) === b[1] )
c.append('conditions', '$regex', (a, b, c) => !!a.match(new RegExp(b, c.$options)) )
c.append('expansions', '$options', true ) // hack
// $text
c.append('conditions', '$where', (a, b, c) => b(a) )

// Geospatial

// $geoWithin
// $geoIntersects
// $near
// $nearSphere

// Array

c.append('conditions', '$all', (a, b) => { b.every((e) => e in a) } )
c.append('conditions', '$elemMatch', (a, b) => { Array.isArray(a) && a.some((e) => this.test(e, b)) } )
c.append('conditions', '$size', (a, b) => { Array.isArray(a) ? b.length : 0 } )

// Extras

c.append('expansions', '$integer', { $typeof: 'number', $mod: [ 1, 0 ] } )
c.append('expansions', '$natural', { $typeof: 'number', $mod: [ 1, 0 ], $gte: 0 } )
c.append('expansions', '$email', { $typeof: 'string', $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i } )

c.append('expansions', '$hex', { $typeof: 'string', $regex: /^[0-9A-F]+$/i } )
c.append('expansions', '$string-object-id', { $typeof: 'string', $regex: /^[0-9A-F]{24}$/i } )
c.append('expansions', '$object-id', { ' $oid': { '$string-object-id': true } } )

// $every
// $any
// $sorted
// $unique
// $type = array
// $date:format
// $date:iso
// $keys
// $exact / $iff
// $creditcard
// $guid
// $hostname http://tools.ietf.org/html/rfc1123
// $downcase
// $upcase
// $trim
//

c.append('transforms', '$length', (a) => {
  let r = undefined
  let t = typeof(a)
  if (t === 'string' || (t === 'object' && a !== null && a.hasOwnProperty('length'))) {
    r = a.length
  }
  return r
})

import * as strftime from './strftime'

c.append('conditions', '$strftime', (a, b) => {
  return strftime.test(b, a)
})

c.append('expansions', '$date-iso', { $strftime: '%Y-%m-%dT%H:%M:%S%Z' })

export function test (a, q) {
  return c.test(a, q)
}
