
import * as is from '../is'

export default {
  conditions: {

    // HACK: To support $regex's $options.
    $options: function (d, q, p) {
      let r = false
      if (!is.none(p.$regex)) {
        r = true
      } else {
        throw new TypeError(`$options reserved for $regex.`)
      }
      return r
    }

  }
}
