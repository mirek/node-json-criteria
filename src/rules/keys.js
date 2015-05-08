
import is from '../is'

export default {
  virtuals: {

    // Returns keys of values.
    $keys: function (d) {
      let r = undefined
      try {
        r = Object.keys(d)
        r.sort()
      } catch (ex) {
      }
      return r
    }

  }
}
