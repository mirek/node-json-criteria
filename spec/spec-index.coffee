
assert = require 'assert'
$ = require '../src'

y = (d, q) -> assert.equal true, $.ev d, q
n = (d, q) -> assert.equal false, $.ev d, q

describe 'ev', ->

  describe 'logical ops', ->

    describe '$and', ->

      it 'should match two positives', ->
        y { foo: bar: '123' }, { $and: [ { 'foo': $exists: true }, { 'foo.bar': { $eq: '123' } } ] }

      it 'should not match one positive and one negative', ->
        n { foo: bar: '123' }, { $and: [ { 'foo': $exists: true }, { 'foo.bar': { $eq: '1234' } } ] }

      it 'should match nested positive', ->
        y { foo: 1, bar: 2}, { $and: [ $and: [ { 'foo': { $eq: 1 } } ] ] }

    describe '$or', ->

      it 'should match one positive', ->
        y { foo: 1 }, { $or: [ { 'foo': $gt: 0 } ] }

      it 'should match one positive and one negative', ->
        y { foo: 1 }, { $or: [ { 'foo': $gt: 0 }, { 'foo': $lt: -1 } ] }

      it 'should not match two negatives', ->
        n { foo: 1 }, { $or: [ { 'foo': $gt: 2 }, { 'foo': $lt: 0 } ] }

      it 'should not match single negatives', ->
        n { foo: 1 }, { $or: [ { 'foo2': $eq: 1 } ] }

    describe '$nor', ->

      it 'should not match single positive', ->
        n { foo: 1 }, { $nor: [ { 'foo': $eq: 1 } ] }

      it 'should match single negative', ->
        y { foo: 1 }, { $nor: [ { 'foo': $eq: 2 } ] }

      it 'should match two negatives', ->
        y { foo: 1 }, { $nor: [ { 'foo': $eq: 2 }, { 'bar': $eq: 1 } ] }

      it 'should not match one positive and one negative', ->
        n { foo: 1 }, { $nor: [ { 'foo': $eq: 2 }, { 'foo': $eq: 1 } ] }

    describe '$not', ->

      it 'should not match negated positive equality', ->
        n { foo: 1 }, { 'foo': $not: $eq: 1 }

      it 'should match negated negative equality', ->
        y { foo: 1 }, { 'foo': $not: $eq: 2 }

  it 'should work with nothing', ->
    y null, null

  it 'should match eq', ->
    y { foo: 1 }, { 'foo': { $eq: 1 } }

  it 'should not match eq', ->
    n { foo: 1 }, { 'foo': { $eq: 2 } }

  it 'should not match non existing eq', ->
    n { foo: 1 }, { 'foo2': { $eq: 1 } }

  it 'should work with simple $and', ->
    y { foo: bar: 1 }, { $and: [ { 'foo.bar': { $eq: 1 } }, { 'foo': $exists: true } ] }

  it 'should work with simple $exists false', ->
    n { foo: bar: 1 }, { 'foo.bar': $exists: false }

  it 'should work with simple $exists false 2', ->
    n { foo: bar: 1 }, { 'foo.baz': $exists: true }

  it 'should work with simple $exists false', ->
    y { foo: bar: 1 }, { 'foo.bar': $exists: true }

  it 'should not match lt', ->
    n { foo: bar: 123 }, { 'foo.bar': { $lt: 100 } }
