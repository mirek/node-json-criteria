
import * as ensure from '../ensure'

export default {
  conditions: {

    $regex: function (d, q, p) {
      return !!d.match(new RegExp(q, p.$options))
    }

  }
}
