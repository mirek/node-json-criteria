
import assert from 'assert'
import { ext } from '../src'

let y = (a, q) => assert.equal(true, ext.test(a, q))
let n = (a, q) => assert.equal(false, ext.test(a, q))

describe('ext', () => {

  it('should have undefined $ext:length for nulls', () => {
    n({ foo: null }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    y({ foo: null }, { foo: { '$ext:length': { $eq: undefined } } })
  })

  it('should have undefined $ext:length for numbers', () => {
    n({ foo: 3 }, { foo: { '$ext:length': 3 } })
  })

  it('should have correct $length for strings', () => {
    n({ foo: '' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    n({ foo: 'h' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'he' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'hel' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    y({ foo: 'hell' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
    n({ foo: 'hello' }, { foo: { '$ext:length': { $gt: 1, $lt: 5 } } })
  })

  it('should have correct length for arrays', () => {
    y({ foo: [ 3 ] }, { foo: { '$ext:length': 1 } })
    n({ foo: [ 3 ] }, { foo: { '$ext:length': 4 } })
  })

  it('should test $ext:email', () => {
    y({ foo: 'mirek@test.com' }, { foo: { '$ext:email': true } })
    n({ foo: 'mirek@@test.com' }, { foo: { '$ext:email': true } })
    n({ foo: 'mirekrusin.com' }, { foo: { '$ext:email': true } })
  })

  it('should match $ext:objectid', () => {
    y({ foo: { $oid: '54d72bbf562d4b42fc4802cd' } }, { foo: { '$ext:objectid': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802c' } }, { foo: { '$ext:objectid': true } })
    n({ foo: { $oid: '54d72bbf562d4b42fc4802cda' } }, { foo: { '$ext:objectid': true } })
    n({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$ext:objectid': true } })
    y({ foo: '54d72bbf562d4b42fc4802cd' }, { foo: { '$ext:objectid:string': true } })
  })

  it('should match $ext:strftime', () => {
    y({ foo: '2015-02-08' }, { foo: { '$ext:strftime': '%Y-%m-%d' } })
    n({ foo: '2015-02-08a' }, { foo: { '$ext:strftime': '%Y-%m-%d' } })
    n({ foo: '2015-02-8' }, { foo: { '$ext:strftime': '%Y-%m-%d' } })
    n({ foo: '2015-2-8' }, { foo: { '$ext:strftime': '%Y-%m-%d' } })
    n({ foo: 'bar' }, { foo: { '$ext:strftime': '%Y-%m-%d' } })
  })

  it('should match $ext:strftime:iso', () => {
    y({ foo: '2015-02-08T00:00:00Z' }, { foo: { '$ext:strftime:iso': true } })
    n({ foo: '2015-02-08 00:00:00Z' }, { foo: { '$ext:strftime:iso': true } })
  })

})
