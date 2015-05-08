
import * as strftime from '../strftime'

export default {
  conditions: {

    // Matches strings with specified date-time format.
    $strftime: function (d, q) {
      return strftime.test(q, d)
    }

  }
}
