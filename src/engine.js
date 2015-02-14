
import * as is from './is'
import same from './same'
import { kvs, resolve, decoded } from './utils'

export default class Engine {

  constructor ({ virtuals = [], conditions = [], expansions = []} = {}) {
    this.registry = { virtuals, conditions, expansions }
  }

  clone () {
    return new Engine({
      virtuals: this.registry.virtuals.slice(),
      conditions: this.registry.conditions.slice(),
      expansions: this.registry.expansions.slice()
    })
  }

  append (t, k, f) {
    this.registry[t].push([ k, f ])
  }

  prepend (t, k, f) {
    this.registry[t].shift([ k, f ])
  }

  replace (t, k, f) {
    let [ tk ] = this.rule(k)
    if (tk) {
      this.registry[tk][k] = f
    } else {
      this.append(t, k, f)
    }
  }

  // Find rule with k name.
  rule (k) {
    let r = [ undefined, undefined ]
    for (let [ tk, tv ] of kvs(this.registry)) {
      for (let [ rk, rf ] of tv) {
        if (k === rk) {
          r = [ tk, rf ]
          break
        }
      }
    }
    return r
  }

  test (d, q = {}) {
    let r = true

    if (is.leaf(q)) {

      // Implicit equality.
      r = r && same(d, q)
    } else {
      for (let [ qk, qv ] of kvs(q)) {
        if (qk[0] === '$') {

          let [ t, f ] = this.rule(qk)
          switch (t) {
            case 'expansions': r = r && this.test(d, f); break
            case 'virtuals': r = r && this.test(f.bind(this)(d, qv), qv); break
            case 'conditions': r = r && f.bind(this)(d, qv, q); break
            default: throw new Error(`Unknown rule ${qk}`)
          }

          if (r === false) {
            break
          }
        } else {

          // Allow _$foo to reference $foo attributes.
          let tqk = decoded(qk)
          let [ dvp, dk ] = resolve(d, tqk) || []
          if (dvp !== null && dk.length === 1) {

            // ...it's resolved
            r = r && this.test(dvp[dk[0]], qv)
          } else {

            // We can still match `{ $exists: false }`, possibly in nested
            // `{ $or: [] }`.
            r = r && this.test(undefined, qv)
          }
        }
      }
    }

    return r
  }
}
