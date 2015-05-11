
import * as ensure from '../ensure'

export default {
  conditions: {

    $nor: function (d, q) {
      ensure.array(q)
      return q.reduce(((p, c) => p && !this.test(d, c)), true)
    }

  }
}
