
import * as ensure from '../ensure'

export default {
  conditions: {

    $mod: function (d, q) {
      ensure.array(q, { length: 2 })
      return (d % q[0]) === q[1]
    }

  }
}
