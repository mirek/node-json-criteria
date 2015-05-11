
import * as is from '../is'

export default {
  conditions: {

    $exists: function (d, q) {
      return !((!!q) ^ !is.none(d))
    }

  }
}
