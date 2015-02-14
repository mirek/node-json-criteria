
import mongo from './mongo'

const extended = mongo.clone()
export default extended

export function test (json, query) {
  return extended.test(json, query)
}

extended.append('conditions', '$typeof', function (a, b) { return typeof(a) === b })

extended.append('expansions', '$integer', { $typeof: 'number', $mod: [ 1, 0 ] } )
extended.append('expansions', '$natural', { $typeof: 'number', $mod: [ 1, 0 ], $gte: 0 } )
extended.append('expansions', '$email', { $typeof: 'string', $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i } )

extended.append('expansions', '$hex', { $typeof: 'string', $regex: /^[0-9A-F]+$/i } )
extended.append('expansions', '$string-object-id', { $typeof: 'string', $regex: /^[0-9A-F]{24}$/i } )
extended.append('expansions', '$object-id', { ' $oid': { '$string-object-id': true } } )

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

extended.append('virtuals', '$length', function (a) {
  let r = undefined
  if (a != null && a.hasOwnProperty('length')) {
    r = a.length
  }
  return r
})

import * as strftime from '../strftime'

extended.append('conditions', '$strftime', function (a, b) {
  return strftime.test(b, a)
})

extended.append('expansions', '$date-iso', { $strftime: '%Y-%m-%dT%H:%M:%S%Z' })
