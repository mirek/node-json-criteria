
export default {
  virtuals: {

    // Returns length of arrays, strings and all objects with .length property.
    $length: function (d) {
      let r = undefined
      if (d != null && d.hasOwnProperty('length')) {
        r = d.length
      }
      return r
    }

  }
}
