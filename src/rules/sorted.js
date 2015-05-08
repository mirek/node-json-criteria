import is from '../is'

export default {
  conditions: {

    // Evaluates to true if value is sorted array.
    //
    // TODO: q true, false, 1, -1
    $sorted: function (d, q) {
      let r = false

      // Comparision direction.
      let cmp = undefined
      switch (q) {
        case -1:
          cmp = function (a, b) { return a >= b }
          break
        default:
          cmp = function (a, b) { return a <= b }
          break
      }

      // Result mangle.
      let rm = undefined
      switch (q) {
        case false:
          rm = function (r) { return !r }
          break
        default:
          rm = function (r) { return r }
          break
      }

      if (is.array(d)) {
        r = true
        let n = d.length
        for (let i = 1; i < n; i++) {
          if (!cmp(d[i - 1], d[i])) {
            r = false
            break
          }
        }
      }

      return rm(r)
    }

  }
}
