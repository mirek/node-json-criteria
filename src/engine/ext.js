
import mongo from './mongo'

const ext = mongo.clone()
export default ext

export function test (json, query) {
  return ext.test(json, query)
}

ext.append('expansions', '$ext:int', {
  $type: 'number',
  $mod: [ 1, 0 ]
})

ext.append('expansions', '$ext:natural', {
  $type: 'number',
  $mod: [ 1, 0 ],
  $gte: 0
})

ext.append('expansions', '$ext:email', {
  $type: 'string',
  $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
})

ext.append('expansions', '$ext:hex', {
  $type: 'string',
  $regex: /^[0-9A-F]+$/i
})

ext.append('expansions', '$ext:objectid:string', {
  $type: 'string',
  $regex: /^[0-9A-F]{24}$/i
})

ext.append('expansions', '$ext:objectid', {
  ' $oid': {
    '$ext:objectid:string': true
  }
})

ext.append('virtuals', '$ext:length', function (a) {
  let r = undefined
  if (a != null && a.hasOwnProperty('length')) {
    r = a.length
  }
  return r
})

import * as strftime from '../strftime'

ext.append('conditions', '$ext:strftime', function (a, b) {
  return strftime.test(b, a)
})

ext.append('expansions', '$ext:strftime:iso', {
  '$ext:strftime': '%Y-%m-%dT%H:%M:%S%Z'
})

// Maybe:
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
