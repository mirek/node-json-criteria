
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

    it('should work with simple cases', () => {
      y({ foo: 1 }, { foo: { $eq: 1 } })
      n({ foo: 1 }, { foo: { $eq: 2 } })
      n({ foo: 1 }, { foo: { $eq: '1' } })
    })

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

  describe('$ne', () => {

    it('should match', () => {
      y({ foo: 1 }, { foo: { $ne: 2 } })
    })

    it('should not match', () => {
      n({ foo: 1 }, { foo: { $ne: 1 } })
    })

  })

  describe('$lt', () => {

    it('should match lower than', () => {
      y({ foo: 1 }, { foo: { $lt: 2 } })
    })

    it('should not match lower than', () => {
      n({ foo: 1 }, { foo: { $lt: 1 } })
    })

  })

  describe('$lte', () => {

    it('should match lower than or equal', () => {
      y({ foo: 1 }, { foo: { $lte: 1 } })
    })

    it('should match lower than or equal 2', () => {
      y({ foo: 1 }, { foo: { $lte: 2 } })
    })

    it('should not match lower than or qual', () => {
      n({ foo: 1 }, { foo: { $lte: 0 } })
    })

  })

  describe('$gt', () => {

    it('should match greater than', () => {
      y({ foo: 1 }, { foo: { $gt: 0 } })
    })

    it('should not match greater than', () => {
      n({ foo: 1 }, { foo: { $gt: 1 } })
    })

  })

  describe('$gte', () => {

    it('should match greater than or equal', () => {
      y({ foo: 1 }, { foo: { $gte: 1 } })
    })

    it('should match greater than or equal 2', () => {
      y({ foo: 1 }, { foo: { $gte: 0 } })
    })

    it('should not match greater than or qual', () => {
      n({ foo: 1 }, { foo: { $gte: 2 } })
    })

  })

  describe('$in', () => {

    it('should match in', () => {
      y({ foo: 1 }, { foo: { $in: [ 1 ] } })
    })

    it('should match in array', () => {
      y({ foo: [ 1, 2, 3 ] }, { foo: { $in: [ 2 ] } })
    })

    it('should match in with more options', () => {
      y({ foo: 1 }, { foo: { $in: [ 2, 3, 1, 4 ] } })
    })

    it('should not match in', () => {
      n({ foo: 1 }, { foo: { $in: [ 2, 3, 4 ] } })
    })

    it('should match $in with scalar on the right', () => {
      y({ foo: [ 1, 2, 3 ] }, { foo: { $in: 2 } })
    })

    it('should not match $in with scalar on the right', () => {
      n({ foo: [ 1, 2, 3 ] }, { foo: { $in: 4 } })
    })

    it('should not match $in with scalar on the right', () => {
      y({ foo: [ 1, 2, 3 ] }, { foo: { $nin: 4 } })
    })

  })

  describe('$nin', () => {

    it('should match not in', () => {
      y({ foo: 1 }, { foo: { $nin: [ 2, 3, 4 ] } })
    })

    it('should not match not in', () => {
      n({ foo: 1 }, { foo: { $nin: [ 1, 2 ] } })
    })

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
