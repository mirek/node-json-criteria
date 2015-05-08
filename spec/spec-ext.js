
import assert from 'assert'
import { ext } from '../src'

let y = (a, q) => assert.equal(true, ext.test(a, q))
let n = (a, q) => assert.equal(false, ext.test(a, q))

describe('ext', () => {

  it('should have undefined $length for nulls', () => {
    n({ foo: null }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    y({ foo: null }, { foo: { '$length': { $eq: undefined } } })
  })

  it('should have undefined $length for numbers', () => {
    n({ foo: 3 }, { foo: { '$length': 3 } })
  })

  it('should have correct $length for strings', () => {
    n({ foo: '' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    n({ foo: 'h' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'he' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'hel' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'hell' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
    n({ foo: 'hello' }, { foo: { '$length': { $gt: 1, $lt: 5 } } })
  })

  it('should have correct length for arrays', () => {
    y({ foo: [ 3 ] }, { foo: { '$length': 1 } })
    n({ foo: [ 3 ] }, { foo: { '$length': 4 } })
  })

  it('should test $email', () => {
    y({ foo: 'mirek@test.com' }, { foo: { '$email': true } })
    n({ foo: 'mirek@@test.com' }, { foo: { '$email': true } })
    n({ foo: 'mirekrusin.com' }, { foo: { '$email': true } })
  })

  it('should match $ext:oid and $string:oid', () => {
    y({ foo: { $oid: '54d72bbf562d4b42fc4802cd' } }, { foo: { '$ext:oid': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802c' } }, { foo: { '$string:oid': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802cda' } }, { foo: { '$string:oid': true } })
    n({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$ext:oid': true } })
    y({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$string:oid': true } })
  })

  it('should match $strftime', () => {
    y({ foo: '2015-02-08' }, { foo: { '$strftime': '%Y-%m-%d' } })
    n({ foo: '2015-02-08a' }, { foo: { '$strftime': '%Y-%m-%d' } })
    n({ foo: '2015-02-8' }, { foo: { '$strftime': '%Y-%m-%d' } })
    n({ foo: '2015-2-8' }, { foo: { '$strftime': '%Y-%m-%d' } })
    n({ foo: 'bar' }, { foo: { '$strftime': '%Y-%m-%d' } })
  })

  it('should match $strftime:iso', () => {
    y({ foo: '2015-02-08T00:00:00Z' }, { foo: { '$strftime:iso': true } })
    n({ foo: '2015-02-08 00:00:00Z' }, { foo: { '$strftime:iso': true } })
  })

})
