
import * as is from '../is'

export default {
  conditions: {

    $all: function (d, q) {
      return is.array(d) && is.array(q) && q.every((e) => d.indexOf(e) >= 0)
    }

  }
}
