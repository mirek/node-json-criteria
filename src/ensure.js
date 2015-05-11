
import * as is from './is'

export function array (a, options = {}) {
  if (is.array(a)) {
    if (options.length !== undefined) {
      if (options.length !== a.length) {
        throw new TypeError(`Expected array with length ${options.length}, got length ${a.length}.`)
      }
    }
  } else {
    throw new TypeError(`Expected array, got ${typeof(a)}.`)
  }
}
