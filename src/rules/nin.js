
import { arrize } from '../utils'

export default {
  conditions: {

    // Evaluates to true if provided value is not in array document.
    $nin: function (d, q) {
      let da = arrize(d)
      return arrize(q).every(function (e) {
        return da.indexOf(e) < 0
      })
    }

  }
}
