
import * as is from '../is'

export default {
  conditions: {

    $elemMatch: function (d, q) {
      return is.array(d) && d.some((e) => this.test(e, q))
    }

  }
}
