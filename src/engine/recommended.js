
import common from './common'

const recommended = common.clone()
export default recommended

export function test (json, query) {
  return recommended.test(json, query)
}

recommended.append('conditions', '$typeof', function (a, b) { return typeof(a) === b })

recommended.append('expansions', '$integer', { $typeof: 'number', $mod: [ 1, 0 ] } )
recommended.append('expansions', '$natural', { $typeof: 'number', $mod: [ 1, 0 ], $gte: 0 } )
recommended.append('expansions', '$email', { $typeof: 'string', $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i } )

recommended.append('expansions', '$hex', { $typeof: 'string', $regex: /^[0-9A-F]+$/i } )
recommended.append('expansions', '$string-object-id', { $typeof: 'string', $regex: /^[0-9A-F]{24}$/i } )
recommended.append('expansions', '$object-id', { ' $oid': { '$string-object-id': true } } )

// $every
// $any
// $sorted
// $unique
// $type = array
// $date:format
// $date:iso
// $keys
// $exact / $iff
// $creditcard
// $guid
// $hostname http://tools.ietf.org/html/rfc1123
// $downcase
// $upcase
// $trim
//

recommended.append('virtuals', '$length', function (a) {
  let r = undefined
  let t = typeof(a)
  if (t === 'string' || (t === 'object' && a !== null && a.hasOwnProperty('length'))) {
    r = a.length
  }
  return r
})

import * as strftime from '../strftime'

recommended.append('conditions', '$strftime', function (a, b) {
  return strftime.test(b, a)
})

recommended.append('expansions', '$date-iso', { $strftime: '%Y-%m-%dT%H:%M:%S%Z' })
