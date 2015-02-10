
import { resolve } from 'rus-diff'
import { kvs } from './utils'
import * as is from './is'
import same from './same'

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

    // console.log('->', JSON.stringify({ d, q, this: !!this }, null, '  '))

    for (let [ qk, qv ] of kvs(q)) {
      if (qk[0] === '$') {

        let [ t, f ] = this.rule(qk)

        try {
          switch (t) {
            case 'expansions': r = r && this.test(d, f); break
            case 'transforms': r = r && this.test(f.bind(this)(d, qv), qv); break
            case 'conditions': r = r && f.bind(this)(d, qv, q); break
            default: throw new Error(`Unknown rule ${qk}`)
          }
        } catch (ex) {
          // console.error('!!', { t, f, qk, qv, d, q, ex, stack: ex.stack.split("\n"), this: !!this })
          r = false
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

    // console.log('<-', JSON.stringify({ r, d, q }, null, '  '))

    return r
  }
}

let c = new Criteria()

// Comparision

c.append('conditions', '$eq', function (a, b) { return same(a, b) } )
c.append('conditions', '$gt', function (a, b) { return a > b } )
c.append('conditions', '$gte', function (a, b) { return a > b } )
c.append('conditions', '$lt', function (a, b) { return a < b } )
c.append('conditions', '$lte', function (a, b) { return a <= b } )
c.append('conditions', '$ne', function (a, b) { return !same(a, b) } )
c.append('conditions', '$in', function (a, b) { let aa = arrize(a); return arrize(b).some((e) => e in aa) } )
c.append('conditions', '$nin', function (a, b) { let aa = arrize(a); return arrize(b).every((e) => !(e in aa)) } )

// Logical

c.append('conditions', '$or', function (a, b) { return b.reduce(((p, c) => p || this.test(a, c)), false) })
c.append('conditions', '$and', function (a, b) { return b.reduce(((p, c) => p && this.test(a, c)), true) })
c.append('conditions', '$not', function (a, b) { return !this.test(a, b) })
c.append('conditions', '$nor', function (a, b) { return b.reduce(((p, c) => p && !this.test(a, c)), true) })

// Element

c.append('conditions', '$exists', function (a, b) { return !((!!b) ^ !is.nil(a)) })
c.append('conditions', '$typeof', function (a, b) { return typeof(a) === b }) // MongoDB discrepancy

// Evaluation

c.append('conditions', '$mod', function (a, b) { return (a % b[0]) === b[1] } )
c.append('conditions', '$regex', function (a, b, c) { return !!a.match(new RegExp(b, c.$options)) } )
c.append('expansions', '$options', true ) // hack
// $text
c.append('conditions', '$where', function (a, b, c) { return b(a) } )

// Geospatial

// $geoWithin
// $geoIntersects
// $near
// $nearSphere

// Array

c.append('conditions', '$all', function (a, b) { return b.every((e) => e in a) } )
c.append('conditions', '$elemMatch', function (a, b) { return is.array(a) && a.some((e) => this.test(e, b)) } )
c.append('conditions', '$size', function (a, b) { return is.array(a) ? b.length : 0 } )

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

c.append('transforms', '$length', function (a) {
  let r = undefined
  let t = typeof(a)
  if (t === 'string' || (t === 'object' && a !== null && a.hasOwnProperty('length'))) {
    r = a.length
  }
  return r
})

import * as strftime from './strftime'

c.append('conditions', '$strftime', function (a, b) {
  return strftime.test(b, a)
})

c.append('expansions', '$date-iso', { $strftime: '%Y-%m-%dT%H:%M:%S%Z' })

export function test (a, q) {
  return c.test(a, q)
}
