
import is from '../is'

export default {
  conditions: {

    // Evaluates to true if all conditions are met, false otherwise.
    $none: function (d, q) {
      return is.array(d) && d.every((e) => this.test(e, q))
    }

  }
}
