
export default {
  conditions: {

    $where: function (d, q) {
      return q(d)
    }

  }
}
