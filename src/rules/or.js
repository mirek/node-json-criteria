
import * as ensure from '../ensure'

export default {
  conditions: {

    $or: function (d, q) {
      ensure.array(q)
      return q.reduce(((p, c) => p || this.test(d, c)), false)
    }

  }
}
