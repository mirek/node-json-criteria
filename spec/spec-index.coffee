
assert = require 'assert'
$ = require '../src'

describe 'ev', ->

  describe 'logical ops', ->

    describe '$and', ->

      it 'should match two positives', ->
        assert.equal true, $.ev { foo: bar: '123' }, { $and: [ { 'foo': $exists: true }, { 'foo.bar': { $eq: '123' } } ] }

      it 'should not match one positive and one negative', ->
        assert.equal false, $.ev { foo: bar: '123' }, { $and: [ { 'foo': $exists: true }, { 'foo.bar': { $eq: '1234' } } ] }

      it 'should match nested positive', ->
        assert.equal true, $.ev { foo: 1, bar: 2}, { $and: [ $and: [ { 'foo': { $eq: 1 } } ] ] }

    describe '$or', ->

      it 'should match one positive', ->
        assert.equal true, $.ev { foo: 1 }, { $or: [ { 'foo': $gt: 0 } ] }

      it 'should match one positive and one negative', ->
        assert.equal true, $.ev { foo: 1 }, { $or: [ { 'foo': $gt: 0 }, { 'foo': $lt: -1 } ] }

      it 'should not match two negatives', ->
        assert.equal false, $.ev { foo: 1 }, { $or: [ { 'foo': $gt: 2 }, { 'foo': $lt: 0 } ] }

      it 'should not match single negatives', ->
        assert.equal false, $.ev { foo: 1 }, { $or: [ { 'foo2': $eq: 1 } ] }

  it 'should work with nothing', ->
    assert.equal true, $.ev()

  it 'should match eq', ->
    assert.equal true, $.ev { foo: 1 }, { 'foo': { $eq: 1 } }

  it 'should not match eq', ->
    assert.equal false, $.ev { foo: 1 }, { 'foo': { $eq: 2 } }

  it 'should not match non existing eq', ->
    assert.equal false, $.ev { foo: 1 }, { 'foo2': { $eq: 1 } }

  it 'should work with simple $and', ->
    assert.equal true, $.ev { foo: bar: 1 }, { $and: [ { 'foo.bar': { $eq: 1 } }, { 'foo': $exists: true } ] }

  it 'should work with simple $exists false', ->
    assert.equal false, $.ev { foo: bar: 1 }, { 'foo.bar': $exists: false }

  it 'should work with simple $exists false 2', ->
    assert.equal false, $.ev { foo: bar: 1 }, { 'foo.baz': $exists: true }

  it 'should work with simple $exists false', ->
    assert.equal true, $.ev { foo: bar: 1 }, { 'foo.bar': $exists: true }

  it 'should not match lt', ->
    assert.equal false, $.ev { foo: bar: 123 }, { 'foo.bar': { $lt: 100 } }
