
require '6to5/register'

assert = require 'assert'
{ test } = require '../src/engine/mongo'

y = (d, q) -> assert.equal true, test d, q
n = (d, q) -> assert.equal false, test d, q

describe 'test', ->

  describe 'logical ops', ->

    describe 'array query ops', ->

      describe '$elemMatch', ->

        it 'should match', ->
          y { foo: bar: [ 1, 3, 5 ] }, { 'foo.bar': $elemMatch: { $eq: 3 } }

        it 'should not match', ->
          n { foo: bar: [ 1, 3, 5 ] }, { 'foo.bar': $elemMatch: { $eq: 4 } }

        it 'should match with $where', ->
          y { foo: bar: [ 1, 3, 5 ] }, { 'foo.bar': $elemMatch: { $where: (v) -> v is 5 } }

      describe '$size', ->

        it 'should match', ->
          y { foo: bar: [ 1, 3, 5 ] }, { 'foo.bar': $size: 3 }

        it 'should not match', ->
          n { foo: bar: [ 1, 3, 5 ] }, { 'foo.bar': $size: 1 }

  describe 'others and corner cases', ->

    it 'should match in namespace #1', ->
      q = {
        foo: {
          beg: { $gt: 1 },
          end: { $lt: 10 }
        },
        bar: {
          beg: { $gt: 11 },
          end: { $lt: 20 }
        }
      }
      y { foo: { beg: 2, end: 9 }, bar: { beg: 12, end: 19 } }, q
      n { foo: { beg: 1, end: 9 }, bar: { beg: 12, end: 19 } }, q
      n { foo: { beg: 2, end: 10 }, bar: { beg: 12, end: 19 } }, q
      n { foo: { beg: 2, end: 9 }, bar: { beg: 11, end: 19 } }, q
      n { foo: { beg: 2, end: 9 }, bar: { beg: 12, end: 20 } }, q

    it 'should match in namespace #2', ->
      q = {
        foo: {
          $or: [
            { $eq: 'max' }
            { $gte: 10 }
          ]
        }
      }
      y { foo: 'max' }, q
      y { foo: 10 }, q
      y { foo: 11 }, q
      n { foo: 9 }, q
      n { foo: 'min' }, q

    it 'should match range', ->
      y { foo: bar: 1 }, { 'foo.bar': { $gt: 0, $lte: 1 } }

    it 'should not match range', ->
      n { foo: bar: 2 }, { 'foo.bar': { $gt: 0, $lte: 1 } }

    it 'should match if nothing is provided', ->
      y null, null
      n {}, null
      n null, {}
      y {}, {}

    it 'should throw if op is not found', ->
      assert.throws -> test { foo: 1 }, { $foo: 1 }

    it 'should work with example #0', ->
      y {"meta":{"duration":{"milliseconds":1,"seconds":0.001,"readable":{"seconds":"0.00 sec"}},"bg":false},"group":{"name":"hello-a"}}, {"group.name":{"$eq":"hello-a"},"meta.bg":{"$eq":false}}

    it 'should work with example #1', ->
      n {"meta":{"duration":{"milliseconds":1,"seconds":0.001,"readable":{"seconds":"0.00 sec"}},"bg":false}}, {"group.name":{"$eq":"hello-a"},"meta.bg":{"$eq":0}}

    it 'should work with #1', ->
      a = {
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
      y a, { update: { $eq: { "ok": 1, "nModified": 1, "n": 1 } } }
      n a, { update: { $eq: { "ok": 1, "nModified": 2, "n": 1 } } }
      n a, { update: { $eq: { "ok": 1, "nModified": 1, "x": 1 } } }
