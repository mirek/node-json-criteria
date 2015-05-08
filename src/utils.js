
import assert from 'assert'
import { digest } from 'json-hash'
import * as is from './is'

// S.R. Petrick, "A Direct Determination of the Irredundant Forms of a Boolean Function from the Set of Prime Implicants"
// Technical Report AFCRC-TR-56-110, Air Force Cambridge Research Center, Cambridge, Mass., Apr. 1956.
export function patrics (minterms) {

  // Get prime implicants.
  let F = {}
  for (let minterm of minterms) {
    if (minterm[2] !== 'v') {
      if (!F[minterm[0]]) {
        F[minterm[0]] = minterm[3]
      }
    }
  }

  let P = []
  let PO = {}
  let alpha = 'abcdefghijklmnopqrstuvwxy'
  let ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXY'
  for (let k in F) {
    let v = F[k]
    let pk = k.split('').map(function (e, i) {
      return { '0': ALPHA[i], '1': alpha[i], '-': null }[e] }
    ).filter((e) => e).join('')
    P.push([ pk, v ])
    for (let pi of v) {
      PO[pi] = true
    }
  }
  let PI = Object.keys(PO).map((e) => parseInt(e)).sort()

  // console.log('P:')
  // P.forEach(function (p, i) {
  //   console.log(`P${i}`, p[0], p[1].join(', '))
  // })
  //
  // console.log('PI:')
  // console.log(PI)
  //
  let PR = PI.map(function (pi) {
    let r = []
    P.forEach(function (e, i) {
      if (e[1].indexOf(pi) !== -1) {
        r.push(i)
      }
    })
    return r.map((e) => `P${e}`)
  })

  // console.log('PR:', PR.map((e) => `(${e.join(' + ')})`).join(' '))

  let PM = PR.map((e) => e.map((f) => [f]))
  while (PM.length > 1) {
    let p = PM.pop()
    p.forEach((e) => {
      e.forEach((e2) => {
        PM.forEach((f) => {
          f.forEach((g) => {
            if (g.indexOf(e2) === -1) {
              g.push(e2)
            }
          })
        })
      })
    })
  }

  // return PM[0].map((e) => e.join('')).join('+')
  // console.log('PM0:', PM[0].map((e) => e.join('*')).join(' + '))
  return PM[0].map((e) => {
    return e.map((f) => {
      return P[parseInt(f.substr(1))][0]
    }).join('')
  }).join('+')
}

export function patrics2 (minterms) {
  let P = patrics(minterms)
  let alpha = 'abcdefghijklmnopqrstuvwxy'
  let ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXY'

  let or = P.split('+').map(function (p) {

    let and = p.split('').map((e) => alpha.indexOf(e)).filter((e) => e !== -1)
    let nor = p.split('').map((e) => ALPHA.indexOf(e)).filter((e) => e !== -1)

    let r = {}
    if (and.length > 0) {
      r.$and = and
    }
    if (nor.length > 0) {
      r.$nor = nor
    }
    if (Object.keys(r).length > 0) {
      return r
    } else {
      return null
    }
  })

  if (or.length > 0) {
    if (or.length === 1) {
      return or[0]
    } else {
      return { $or: or }
    }
  } else {
    return null
  }
}

// Minterm expansion.
export function mintermexp (minterms) {

  function diff (a, b) {
    let r = []
    let n = 0
    let f = false
    for (let i = 0; i < a.length; i++) {
      if ((a[i] === '0' && b[i] === '1') || (a[i] === '1' && b[i] === '0')) {
        r.push('-')
        if (++n > 1) {
          f = true
          break
        }
      } else {
        if (a[i] === b[i]) {
          r.push(a[i])
        } else {
          f = true
          break
        }
      }
    }
    if (f) {
      return false
    } else {
      return r.join('')
    }
  }

  function combine1 (i) {
    let r = []
    for (; i < minterms.length; i++) {
      let o = minterms[i][1]
      for (let j = i + 1; j < minterms.length; j++) {
        let od = minterms[j][1] - o
        if (od === 0) {
          continue
        }
        if (od === 1) {
          let d = diff(minterms[i][0], minterms[j][0])
          if (d) {
            let _1s = d.split('').filter((e) => e === '1').length
            minterms[i][2] = 'v'
            minterms[j][2] = 'v'
            let k = []
            for (let z of [ minterms[i][3], minterms[j][3] ]) {
              for (let l of z) {
                if (k.indexOf(l) === -1) {
                  k.push(l)
                }
              }
            }
            r.push([ d, _1s, ' ', k ])
          }
        } else {
          break
        }
      }
    }

    // r.sort((a, b) => a[1] - b[1])

    for (let e of r) {
      minterms.push(e)
    }

    return i
  }

  {
    let i = 0
    while (true) {
      let j = combine1(i)
      if (i == j) {
        break
      } else {
        i = j
      }
    }
  }
}

// Generate initial minterms.
export function minterms (q, n) {
  let r = []
  for (let i = 0; i < 2 ** n; i++) {

    // String binary representation.
    let s = new Array(n).fill('0').map((e, j) => ((1 << j) & i) ? '1' : '0' ).join('')

    // Number of 1s.
    let _1s = s.split('').filter((e) => e === '1').length

    if (itest(q, i)) {
      r.push([ s, _1s, ' ', [ i ] ])
    }
  }

  // Sort by count of 1s.
  r.sort((a, b) => a[1] - b[1])

  return r
}

export function itest2 (qa, qb, n) {
  let r = true
  for (let i = 0; i < 2 ** n; i++) {
    let ra = itest(qa, i)
    let rb = itest(qb, i)
    if (ra !== rb) {
      let s = new Array(n).fill('0').map((e, j) => ((1 << j) & i) ? '1' : '0' ).join('')
      console.error(`${ra} !== ${rb} for ${s}`)
      r = false
      break
    }
  }
  return r
}

// Perform query test using binary as input.
//
// @param [Object] q Index map query, ie. `{ $and: [ 0, { $or: [ 1, 2 ] } ] }`
// @param [Number] i Binary input, ie. `0b101` means 0 - true, 1 - false, 2 - true.
// @return [Boolean] True if criteria is satisfied, false otherwise.
export function itest (q, i) {
  let r = false
  if (is.number(q)) {
    r = (1 << q) & i ? true : false
  } else {
    r = [ '$and', '$or', '$nor', '$not' ].every(
      function (k) {
        let r = true
        if (is.none(q[k])) {
          r = true
        } else {
          switch (k) {
            case '$and':
              r = q[k].every((e) => itest(e, i))
              break
            case '$or':
              r = q[k].some((e) => itest(e, i))
              break
            case '$nor':
              r = q[k].every((e) => !itest(e, i))
              break
            case '$not':
              r = !itest(q[k], i)
              break
          }
        }
        return r
      }
    )
  }
  return r
}

// Map query to fragments.
export function map (q, f) {
  let r = null
  if (is.plain(q)) {
    r = {}
    let d = {}

    // Split fragment and query parts.
    for (let [ k, v ] of kvs(q)) {
      if ([ '$and', '$or', '$nor' ].indexOf(k) !== -1) {
        r[k] = map(v, f)
      } else {
        d[k] = v
      }
    }

    if (!is.leaf(d)) {
      let fd = f(d)
      if (is.leaf(r)) {
        r = fd
      } else {
        r = { $and: [ fd, r ] }
      }
    }
  } else {
    if (is.array(q)) {
      r = q.map((e) => map(e, f))
    } else {
      r = f(q)
    }
  }
  return r
}

export function unmap (q, fs) {
  let r = null
  if (is.plain(q)) {
    r = {}
    for (let [ k, v ] of kvs(q)) {
      r[k] = unmap(v, fs)
    }
  } else {
    if (is.array(q)) {
      r = q.map((e) => unmap(e, fs))
    } else {
      r = fs[q][1]
    }
  }
  return r
}

export function minimize (qr) {
  let fs = []
  let q = map(qr, (e) => {
    let d = digest(e)
    let i = fs.findIndex((f) => f[0] == d)
    if (i === -1) {
      i = fs.length
      fs.push([ d, e ])
    }
    return i
  })
  let minterms_ = minterms(q, fs.length)
  mintermexp(minterms_)
  let p = patrics2(minterms_)
  assert.ok((itest2(q, p, fs.length)))
  let r = unmap(p, fs)
  let rks = Object.keys(r)
  if (rks.length === 1 && rks[0] === '$and' && r[rks[0]].length === 1) {
    r = r[rks[0]][0]
  }
  return r
}

export function biconditional (a, b) {
  return (!!a ^ !!b) ? false : true
}

// Decode query key from ' $foo' -> '$foo'. Encoding allows to refer to document
// attributes which would conflict with ops.
export function decoded (qk) {
  let r = qk
  let trim = false

loop:
  for (let i = 0; i < qk.length; i++) {
    switch (qk[i]) {
      case ' ':
        trim = true
        continue loop

      case '$':
        if (trim) {
          r = qk.substr(1)
        }
        break loop

      default:
        break loop
    }
  }

  return r
}

// Arrize path by splitting 'foo.bar' -> [ 'foo', 'bar' ], unless string starts
// with ' ' then ' foo.bar' -> [ 'foo.bar' ].
export function split (a) {
  let r = undefined
  if (a[0] === ' ') {
    r = [ a.substring(1) ]
  } else {
    r = a.split('.')
  }
  return r
}

// Resolve key path on an object.
export function resolve (a, path) {
  let stack = split(path)
  let last = []

  if (stack.length > 0) {
    last.unshift(stack.pop())
  }

  let k = undefined
  let e = a
  if (!is.none(e)) {
    while (!is.none(k = stack.shift())) {
      if (!is.none(e[k])) {
        e = e[k]
      } else {
        stack.unshift(k)
        break
      }
    }
  }

  // Pull all unresolved components into last.
  while (!is.none((k = stack.pop()))) {
    last.unshift(k)
  }

  return [ e, last ]
}

export function arrize (a) {
  return Array.isArray(a) ? a : [ a ]
}

export function* kvs (a) {
  if (is.object(a)) {
    for (let k of Object.keys(a)) {
      if (a.hasOwnProperty(k)) {
        yield [k, a[k]]
      }
    }
  }
}
