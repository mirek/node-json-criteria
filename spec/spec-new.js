
import assert from 'assert'
import { test } from '../src/new'

let y = (a, q) => assert.equal(true, test(a, q))
let n = (a, q) => assert.equal(false, test(a, q))

describe('test', () => {


  describe('$and', () => {

    it('should match two positives', () => {
      y({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': { $eq: '123' } } ] })
    })

    it('should not match one positive and one negative', () => {
      n({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': { $eq: '1234' } } ] })
    })

    it('should match nested positive', () => {
      y({ foo: 1, bar: 2}, { $and: [ { $and: [ { foo: { $eq: 1 } } ] } ] })
    })

  })

  describe('$or', () => {

    it('should match one positive', () => {
      y({ foo: 1 }, { $or: [ { foo: { $gt: 0 } } ] })
    })

    it('should match one positive and one negative', () => {
      y({ foo: 1 }, { $or: [ { foo: { $gt: 0 } }, { foo: { $lt: -1 } } ] })
    })

    it('should not match two negatives', () => {
      n({ foo: 1 }, { $or: [ { foo: { $gt: 2 } }, { foo: { $lt: 0 } } ]})
    })

    it('should not match single negatives', () => {
      n({ foo: 1 }, { $or: [ { 'foo2': { $eq: 1 } } ] })
    })

  })

  describe('$nor', () => {

    it('should not match single positive', () => {
      n({ foo: 1 }, { $nor: [ { foo: { $eq: 1 } } ] })
    })

    it('should match single negative', () => {
      y({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } } ] })
    })

    it('should match two negatives', () => {
      y({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } }, { 'bar': { $eq: 1 } } ] })
    })

    it('should not match one positive and one negative', () => {
      n({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } }, { foo: { $eq: 1 } } ] })
    })

  })

  describe('$not', () => {

    it('should not match negated positive equality', () => {
      n({ foo: 1 }, { foo: { $not: { $eq: 1 } } })
    })

    it('should match negated negative equality', () => {
      y({ foo: 1 }, { foo: { $not: { $eq: 2 } } })
    })

  })

  describe('$eq', () => {

    it('should match', () => {
      y({ foo: 1 }, { foo: { $eq: 1 } })
    })

    it('should not match', () => {
      n({ foo: 1 }, { foo: { $eq: 2 } })
    })

    it('should not match non existing', () => {
      n({ foo: 1 }, { bar: { $eq: 2 } })
    })

    it('should match ext json', () => {
      y({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $eq: 1413850114241 } })
      n({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $eq: 1413850114242 } })
      n({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $ne: 1413850114241 } })
    })

    it('should match nested', () => {
      y({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar: 2, foo: 1 } } })
      n({ doc: { foo: 1, bar: 2 } }, { doc: { $ne: { bar: 2, foo: 1 } } })
      n({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar2: 2, foo: 1 } } })
      y({ doc: { foo: 1, bar: { baz: 2 } } }, { doc: { $eq: { bar: { baz: 2 }, foo: 1 } } })
    })

  })

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
