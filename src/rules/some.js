import is from '../is'

export default {
  conditions: {

    // Evaluates to true if at least one condition is met, false otherwise.
    $none: function (d, q) {
      return is.array(d) && d.some((e) => this.test(e, q))
    }

  }
}
