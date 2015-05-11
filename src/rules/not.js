
import * as ensure from '../ensure'

export default {
  conditions: {

    $not: function (d, q) {
      return !this.test(d, q)
    }

  }
}
