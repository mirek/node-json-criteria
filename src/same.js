
import * as is from './is'

// Return true if arrays are the same.
export function arrays (a, b, sort = false) {
  let r = true
  let an = a.length
  let bn = b.length
  if (an === bn) {
    if (sort) {
      a.sort()
      b.sort()
    }
    for (let i = 0; i < an; i++) {
      if (a[i] !== b[i]) {
        r = false
        break;
      }
    }
  } else {
    r = false
  }
  return r
}

// Return true if two values are the same.
export default function same (a, b) {
  let r = false
  switch (true) {

    // Same scalars.
    case a === b:
      r = true
      break

    // Objects.
    case is.object(a) && is.object(b):
      switch (true) {

        // Dates.
        case is.date(a) && is.date(b):
          r = a.getTime() === b.getTime()
          break;

        // RegExps.
        case is.regexp(a) && is.regexp(b):
          r = (
            a.source === b.source &&
            a.global === b.global &&
            a.multiline === b.multiline &&
            a.lastIndex === b.lastIndex &&
            a.ignoreCase === b.ignoreCase
          )
          break

        // Array like.
        case is.array(a) && is.array(b):
        case is.args(a) && is.args(b):
        case is.buffer(a) && is.buffer(b):
          r = arrays(a, b)
          break

        // Other objects.
        default:
          let aks = Object.keys(a)
          let bks = Object.keys(b)
          if (arrays(aks, bks, true)) {
            r = aks.every((k) => same(a[k], b[k]))
          }
          break
      }
      break
  }
  return r
}
