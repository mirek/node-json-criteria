
export default {
  conditions: {

    $type: function (d, q) {
      return typeof(d) === q
    }

  }
}
