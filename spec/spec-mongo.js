
import assert from 'assert'
import { mongo } from '../src'

let y = (a, q) => assert.equal(true, mongo.test(a, q))
let n = (a, q) => assert.equal(false, mongo.test(a, q))

describe('test', () => {

  describe('implicit $eq', () => {
    y({ foo: 1 }, { foo: 1 })
    n({ bar: 1 }, { foo: 1 })
    n({ foo: 1 }, { foo: 2 })
    n({ foo: 1 }, { foo: '1' })
    y({ foo: { bar: 1, baz: 1 } }, { foo: { baz: 1, bar: 1 } })
    n({ foo: { bar: 1, baz: 1 } }, { foo: { baz: 1, bar: '1' } })
    y({ foo: { bar: 2, baz: 1 } }, { 'foo.baz': 1, 'foo.bar': 2 })
    y({ foo: { bar: 2, baz: 1 } }, { $or: [ { 'foo.baz': 2 }, { 'foo.bar': 2 } ]})
  })

  describe('type errors', () => {
    it('should throw for $and: {}', () => {
      assert.throws(() => mongo.test({}, { $and: {} }), TypeError)
    })
    it('should throw for $or: {}', () => {
      assert.throws(() => mongo.test({}, { $or: {} }), TypeError)
    })
    it('should throw for $nor: {}', () => {
      assert.throws(() => mongo.test({}, { $nor: {} }), TypeError)
    })
  })

  describe('$and', () => {

    it('should match two positives', () => {
      y({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': { $eq: '123' } } ] })
      y({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': '123' } ] })
    })

    it('should not match one positive and one negative', () => {
      n({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': { $eq: '1234' } } ] })
      n({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': '1234' } ] })
    })

    it('should match nested positive', () => {
      y({ foo: 1, bar: 2}, { $and: [ { $and: [ { foo: { $eq: 1 } } ] } ] })
      y({ foo: 1, bar: 2}, { $and: [ { $and: [ { foo: 1 } ] } ] })
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
      n({ foo: 1 }, { $or: [ { 'foo2': 1 } ] })
    })

  })

  describe('$nor', () => {

    it('should not match single positive', () => {
      n({ foo: 1 }, { $nor: [ { foo: { $eq: 1 } } ] })
      n({ foo: 1 }, { $nor: [ { foo: 1 } ] })
    })

    it('should match single negative', () => {
      y({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } } ] })
      y({ foo: 1 }, { $nor: [ { foo: 2 } ] })
    })

    it('should match two negatives', () => {
      y({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } }, { 'bar': { $eq: 1 } } ] })
      y({ foo: 1 }, { $nor: [ { foo: 2 }, { 'bar': 1 } ] })
    })

    it('should not match one positive and one negative', () => {
      n({ foo: 1 }, { $nor: [ { foo: { $eq: 2 } }, { foo: { $eq: 1 } } ] })
      n({ foo: 1 }, { $nor: [ { foo: 2 }, { foo: 1 } ] })
    })

  })

  describe('$not', () => {

    it('should not match negated positive equality', () => {
      n({ foo: 1 }, { foo: { $not: { $eq: 1 } } })
      n({ foo: 1 }, { foo: { $not: 1 } })
    })

    it('should match negated negative equality', () => {
      y({ foo: 1 }, { foo: { $not: { $eq: 2 } } })
      y({ foo: 1 }, { foo: { $not: 2 } })
    })

  })

  describe('$eq', () => {

    it('should work with simple cases', () => {
      y({ foo: 1 }, { foo: { $eq: 1 } })
      y({ foo: 1 }, { foo: 1 })
      n({ foo: 1 }, { foo: { $eq: 2 } })
      n({ foo: 1 }, { foo: 2 })
      n({ foo: 1 }, { foo: { $eq: '1' } })
      n({ foo: 1 }, { foo: '1' })
    })

    it('should match', () => {
      y({ foo: 1 }, { foo: { $eq: 1 } })
      y({ foo: 1 }, { foo: 1 })
    })

    it('should not match', () => {
      n({ foo: 1 }, { foo: { $eq: 2 } })
      n({ foo: 1 }, { foo: 2 })
    })

    it('should not match non existing', () => {
      n({ foo: 1 }, { bar: { $eq: 2 } })
      n({ foo: 1 }, { bar: 2 })
    })

    it('should match ext json', () => {
      y({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $eq: 1413850114241 } })
      y({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': 1413850114241 })
      n({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $eq: 1413850114242 } })
      n({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': 1413850114242 })
      n({ updatedAt: { $date: 1413850114241 } }, { 'updatedAt.$date': { $ne: 1413850114241 } })
    })

    it('should match nested', () => {
      y({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar: 2, foo: 1 } } })
      y({ doc: { foo: 1, bar: 2 } }, { doc: { bar: 2, foo: 1 } })
      n({ doc: { foo: 1, bar: 2 } }, { doc: { $ne: { bar: 2, foo: 1 } } })
      n({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar2: 2, foo: 1 } } })
      n({ doc: { foo: 1, bar: 2 } }, { doc: { bar2: 2, foo: 1 } })
      y({ doc: { foo: 1, bar: { baz: 2 } } }, { doc: { $eq: { bar: { baz: 2 }, foo: 1 } } })
      y({ doc: { foo: 1, bar: { baz: 2 } } }, { doc: { bar: { baz: 2 }, foo: 1 } })
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

  describe('$exists', () => {

    it('should match existance', () => {
      y({ foo: { bar: 1 } }, { 'foo.bar': { $exists: true } })
    })

    it('should not match existance', () => {
      n({ foo: { bar: 1 } }, { 'foo.baz': { $exists: true } })
    })

    it('should not match negative existance', () => {
      n({ foo: { bar: 1 } }, { 'foo.bar': { $exists: false } })
    })

    it('should match negative existance', () => {
      y({ foo: { bar: 1 } }, { 'foo.baz': { $exists: false } })
    })

  })

  describe('$mod', () => {

    it('should match', () => {
      y({ foo: { bar: 15 } }, { 'foo.bar': { $mod: [ 5, 0 ] } })
      y({ foo: { bar: 5 } }, { 'foo.bar': { $mod: [ 3, 2 ] } })
      y({ foo: { bar: 15 } }, { 'foo.bar': { $mod: [ 2, 1 ] } })
    })

    it('should not match', () => {
      n({ foo: { bar: 15 } }, { 'foo.bar': { $mod: [ 5, 1 ] } })
      n({ foo: { bar: 5 } }, { 'foo.bar': { $mod: [ 3, 3 ] } })
      n({ foo: { bar: 15 } }, { 'foo.bar': { $mod: [ 2, 0 ] } })
    })

  })

  describe('$regex', () => {

    it('should match', () => {
      y({ foo: { bar: 'baz' } }, { 'foo.bar': { $regex: '^ba.$' } })
    })

    it('should not match', () => {
      n({ foo: { bar: 'baz' } }, { 'foo.bar': { $regex: '^bb.$' } })
    })

    it('should match case insensitive', () => {
      y({ foo: { bar: 'BAZ' } }, { 'foo.bar': { $regex: '^baz$', $options: 'i' } })
    })

  })

  describe('$where', () => {

    it('should match', () => {
      y({ foo: { bar: 'x' } }, { 'foo.bar': { $where: (v) => v === 'x' } })
    })

    it('should not match', () => {
      n({ foo: { bar: 'x' } }, { 'foo.bar': { $where: (v) => v !== 'x' } })
    })

  })

  describe('$all', () => {

    it('should match', () => {
      y({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $all: [ 5, 1 ] } })
    })

    it('should not match', () => {
      n({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $all: [ 1, 2, 3, 5 ] } })
    })

  })

  describe('$elemMatch', () => {

    it('should match', () => {
      y({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $elemMatch: { $eq: 3 } } })
    })

    it('should not match', () => {
      n({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $elemMatch: { $eq: 4 } } })
    })

    it('should match with $where', () => {
      y({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $elemMatch: { $where: (v) => v == 5 } } })
    })

  })

  describe('$size', () => {

    it('should match', () => {
      y({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $size: 3 } })
    })

    it('should not match', () => {
      n({ foo: { bar: [ 1, 3, 5 ] } }, { 'foo.bar': { $size: 1 } })
    })

  })

  describe('other and corner cases', () => {

    it('should match in namespace #1', () => {
      let q = {
        foo: {
          beg: { $gt: 1 },
          end: { $lt: 10 }
        },
        bar: {
          beg: { $gt: 11 },
          end: { $lt: 20 }
        }
      }
      y({ foo: { beg: 2, end: 9 }, bar: { beg: 12, end: 19 } }, q)
      n({ foo: { beg: 1, end: 9 }, bar: { beg: 12, end: 19 } }, q)
      n({ foo: { beg: 2, end: 10 }, bar: { beg: 12, end: 19 } }, q)
      n({ foo: { beg: 2, end: 9 }, bar: { beg: 11, end: 19 } }, q)
      n({ foo: { beg: 2, end: 9 }, bar: { beg: 12, end: 20 } }, q)
    })

    it('should match in namespace #2', () => {
      let q = {
        foo: {
          $or: [
            { $eq: 'max' },
            { $gte: 10 }
          ]
        }
      }
      y({ foo: 'max' }, q)
      y({ foo: 10 }, q)
      y({ foo: 11 }, q)
      n({ foo: 9 }, q)
      n({ foo: 'min' }, q)
    })

    it('should match range', () => {
      y({ foo: { bar: 1 } }, { 'foo.bar': { $gt: 0, $lte: 1 } })
    })

    it('should not match range', () => {
      n({ foo: { bar: 2 } }, { 'foo.bar': { $gt: 0, $lte: 1 } })
    })

    it('should match if nothing is provided', () => {
      y(null, null)
      n({}, null)
      n(null, {})
      y({}, {})
    })

    it('should throw if op is not found', () => {
      assert.throws( () => mongo.test({ foo: 1 }, { $foo: 1 }) )
    })

    it('should work with example #1', () => {
      y({ meta: { duration: { milliseconds: 1, seconds: 0.001, readable: { seconds: '0.00 sec' } }, bg: false }, group: { name: 'hello-a' } }, { 'group.name': { $eq: 'hello-a' }, 'meta.bg': { '$eq': false } })
    })

    it('should work with example #2', () => {
      n({"meta":{"duration":{"milliseconds":1,"seconds":0.001,"readable":{"seconds":"0.00 sec"}},"bg":false}}, {"group.name":{"$eq":"hello-a"},"meta.bg":{"$eq":0}})
    })

    it('should work with example #3', () => {
      let a = {
        "meta": {
          "duration": {
            "milliseconds": 39,
            "seconds": 0.039,
            "readable": {
              "seconds": "0.04 sec"
            }
          },
          "timestamp": 1111111111.11,
          "refresh": "affected",
          "affected": {
            "paths": [
              "kafka.feed_click.domain.111111111111111111111111.name",
              "kafka.feed_click.domain.111111111111111111111111.last_access",
              "kafka.feed_click.domain.111111111111111111111111.count"
            ]
          }
        },
        "update": {
          "ok": 1,
          "nModified": 1,
          "n": 1
        }
      }
      y(a, { update: { $eq: { "ok": 1, "nModified": 1, "n": 1 } } } )
      n(a, { update: { $eq: { "ok": 1, "nModified": 2, "n": 1 } } } )
      n(a, { update: { $eq: { "ok": 1, "nModified": 1, "x": 1 } } } )
    })

  })

  describe('$type', () => {

    it('should match number type', () => {
      y({ foo: { bar: 1.2 } }, { 'foo.bar': { $type: 'number' } })
    })

    it('should match boolean type', () => {
      y({ foo: { bar: true } }, { 'foo.bar': { $type: 'boolean' } })
    })

    it('should match string type', () => {
      y({ foo: { bar: 'foo' } }, { 'foo.bar': { $type: 'string' } })
    })

    it('should match object type', () => {
      y({ foo: { bar: /foo/ } }, { 'foo.bar': { $type: 'object' } })
      y({ foo: { bar: new Date() } }, { 'foo.bar': { $type: 'object' } })
    })

  })

})
