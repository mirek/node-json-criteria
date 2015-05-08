
import mongo from './mongo'

const ext = mongo.clone()
export default ext

export function test (json, query) {
  return ext.test(json, query)
}

// Expansions

ext.append2(require('../rules/array'))
ext.append2(require('../rules/email'))
ext.append2(require('../rules/ext-oid'))
ext.append2(require('../rules/hex'))
ext.append2(require('../rules/number-integer'))
ext.append2(require('../rules/number-natural'))
ext.append2(require('../rules/number'))
ext.append2(require('../rules/string-oid'))
ext.append2(require('../rules/string'))

// Conditions

ext.append2(require('../rules/every'))
ext.append2(require('../rules/is'))
ext.append2(require('../rules/none'))
ext.append2(require('../rules/some'))
ext.append2(require('../rules/strftime-iso'))
ext.append2(require('../rules/strftime'))

// Virtuals

ext.append2(require('../rules/length'))
ext.append2(require('../rules/keys'))

// console.log(JSON.stringify(ext, null, '  '))

// console.log(ext.test({ foo: 1 }, { foo: { $is: 'number' } }))

// console.log(ext.test({ foo: { $oid: '54d72bbf562d4b42fc4802c' } }, { foo: { '$string:oid': true } }))

// $exact / $iff
// $creditcard
// $guid
// $hostname http://tools.ietf.org/html/rfc1123
// $downcase
// $upcase
// $trim
