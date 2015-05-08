
import is from '../is'

export default {
  conditions: {

    // Evaluates to true if all conditions are not met, false otherwise.
    $array: function (d, q) {
      return is.array(d) ^ q
    }

  }
}
