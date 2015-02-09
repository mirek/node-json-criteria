
import assert from 'assert'
import { test } from '../src/new'

let y = (a, q) => assert.equal(true, test(a, q))
let n = (a, q) => assert.equal(false, test(a, q))

describe('test', () => {

  it('should work with simple cases', () => {
    y({ foo: 1 }, { foo: { $eq: 1 } })
    n({ foo: 1 }, { foo: { $eq: 2 } })
    n({ foo: 1 }, { foo: { $eq: '1' } })
  })

  it('should test $length', () => {
    n({ foo: null }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    n({ foo: '' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    n({ foo: 'h' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    y({ foo: 'he' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    y({ foo: 'hel' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    y({ foo: 'hell' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
    n({ foo: 'hello' }, { foo: { $length: { $gt: 1, $lt: 5 } } })
  })

  it('should test $email', () => {
    y({ foo: 'mirek@test.com' }, { foo: { $email: true } })
    n({ foo: 'mirek@@test.com' }, { foo: { $email: true } })
    n({ foo: 'mirekrusin.com' }, { foo: { $email: true } })
  })

  it('should match $object-id', () => {
    y({ foo: { $oid: '54d72bbf562d4b42fc4802cd' } }, { foo: { '$object-id': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802c' } }, { foo: { '$object-id': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802cda' } }, { foo: { '$object-id': true } })
    n({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$object-id': true } })
    y({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$string-object-id': true } })
  })

  it('should match $strftime', () => {
    y({ foo: '2015-02-08' }, { foo: { $strftime: '%Y-%m-%d' } })
    n({ foo: '2015-02-08a' }, { foo: { $strftime: '%Y-%m-%d' } })
    n({ foo: '2015-02-8' }, { foo: { $strftime: '%Y-%m-%d' } })
    n({ foo: '2015-2-8' }, { foo: { $strftime: '%Y-%m-%d' } })
    n({ foo: 'bar' }, { foo: { $strftime: '%Y-%m-%d' } })
  })

  it('should match $date-iso', () => {
    y({ foo: '2015-02-08T00:00:00Z' }, { foo: { '$date-iso': true } })
    n({ foo: '2015-02-08 00:00:00Z' }, { foo: { '$date-iso': true } })
  })

})


// console.log(c.test(
//   {
//     account: {
//       name: "mirek",
//       password: "secret",
//       email: "mirek@me.com"
//     }
//   }
// ,
//   {
//     account: {
//       $exists: false,
//       name: { $typeof: 'string', $length: { $gt: 0, $lte: 10 } }
//     }
//   }
// ))
