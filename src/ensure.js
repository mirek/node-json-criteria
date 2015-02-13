
import * as is from './is'

export function array (a) {
  if (!is.array(a)) throw new TypeError(`Expected array, got ${typeof(a)}.`)
}
