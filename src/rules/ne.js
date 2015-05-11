
import same from '../same'

export default {
  conditions: {
    $ne: function (d, q) {
      return !same(d, q)
    }
  }
}
