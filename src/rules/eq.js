
import same from '../same'

export default {
  conditions: {
    $eq: function (d, q) {
      return same(d, q)
    }
  }
}
