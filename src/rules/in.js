
import { arrize } from '../utils'

export default {
  conditions: {

    // Evaluates to true if provided value is in array document.
    $in: function (d, q) {
      let ad = arrize(d)
      return arrize(q).some(function (e) {
        return ad.indexOf(e) >= 0
      })
    }

  }
}
