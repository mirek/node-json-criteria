
import * as is from '../is'

export default {
  conditions: {

    // Evaluates to true if provided rule name prefixed with $ evaluates to true.
    $is: function (d, q) {
      let r = false
      switch (true) {

        // Single rule, ie: { foo: { $is: 'number' } }
        case is.string(q):
          r = this.test(d, { [`$${q}`]: true })
          break

        // Any of provided rules, ie: { foo: { $is: [ 'number', 'string' ] } }
        case is.strings(q):
          r = this.test(d, {
            $or: q.map(function (e) {
              return { [ `$${e}` ] : true }
            })
          })
          break

        default:
          throw new Error('$is supports string or strings query only for now.')
      }
      return r
    }

  }
}
