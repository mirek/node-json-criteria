
import * as is from '../is'

export default {
  conditions: {

    $size: function (d, q) {
      return q === (is.array(d) ? d.length : 0)
    }

  }
}
