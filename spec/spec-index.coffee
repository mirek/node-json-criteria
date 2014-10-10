
assert = require 'assert'
$ = require '../src'

y = (d, q) -> assert.equal true, $.ev d, q
n = (d, q) -> assert.equal false, $.ev d, q

describe 'ev', ->

  describe 'logical ops', ->

    it 'should match nothing', ->
      y null, null

    describe '$and', ->

      it 'should match two positives', ->
        y { foo: bar: '123' }, { $and: [ { foo: $exists: true }, { 'foo.bar': { $eq: '123' } } ] }

      it 'should not match one positive and one negative', ->
        n { foo: bar: '123' }, { $and: [ { foo: $exists: true }, { 'foo.bar': { $eq: '1234' } } ] }

      it 'should match nested positive', ->
        y { foo: 1, bar: 2}, { $and: [ $and: [ { foo: { $eq: 1 } } ] ] }

    describe '$or', ->

      it 'should match one positive', ->
        y { foo: 1 }, { $or: [ { foo: $gt: 0 } ] }

      it 'should match one positive and one negative', ->
        y { foo: 1 }, { $or: [ { foo: $gt: 0 }, { foo: $lt: -1 } ] }

      it 'should not match two negatives', ->
        n { foo: 1 }, { $or: [ { foo: $gt: 2 }, { foo: $lt: 0 } ] }

      it 'should not match single negatives', ->
        n { foo: 1 }, { $or: [ { 'foo2': $eq: 1 } ] }

    describe '$nor', ->

      it 'should not match single positive', ->
        n { foo: 1 }, { $nor: [ { foo: $eq: 1 } ] }

      it 'should match single negative', ->
        y { foo: 1 }, { $nor: [ { foo: $eq: 2 } ] }

      it 'should match two negatives', ->
        y { foo: 1 }, { $nor: [ { foo: $eq: 2 }, { 'bar': $eq: 1 } ] }

      it 'should not match one positive and one negative', ->
        n { foo: 1 }, { $nor: [ { foo: $eq: 2 }, { foo: $eq: 1 } ] }

    describe '$not', ->

      it 'should not match negated positive equality', ->
        n { foo: 1 }, { foo: $not: $eq: 1 }

      it 'should match negated negative equality', ->
        y { foo: 1 }, { foo: $not: $eq: 2 }

    describe 'comparison ops', ->

      it 'should match equality', ->
        y { foo: 1 }, { foo: $eq: 1 }

      it 'should not match equality', ->
        n { foo: 1 }, { foo: $eq: 2 }

      it 'should not match non existing', ->
        n { foo: 1 }, { bar: $eq: 2 }

      it 'should match non equality', ->
        y { foo: 1 }, { foo: $ne: 2 }

      it 'should not match non equality', ->
        n { foo: 1 }, { foo: $ne: 1 }

      it 'should match lower than', ->
        y { foo: 1 }, { foo: $lt: 2 }

      it 'should not match lower than', ->
        n { foo: 1 }, { foo: $lt: 1 }

      it 'should match lower than or equal', ->
        y { foo: 1 }, { foo: $lte: 1 }

      it 'should match lower than or equal 2', ->
        y { foo: 1 }, { foo: $lte: 2 }

      it 'should not match lower than or qual', ->
        n { foo: 1 }, { foo: $lte: 0 }

      it 'should match greater than', ->
        y { foo: 1 }, { foo: $gt: 0 }

      it 'should not match greater than', ->
        n { foo: 1 }, { foo: $gt: 1 }

      it 'should match greater than or equal', ->
        y { foo: 1 }, { foo: $gte: 1 }

      it 'should match greater than or equal 2', ->
        y { foo: 1 }, { foo: $gte: 0 }

      it 'should not match greater than or qual', ->
        n { foo: 1 }, { foo: $gte: 2 }

      it 'should match in', ->
        y { foo: 1 }, { foo: $in: [ 1 ] }

      it 'should match in with more options', ->
        y { foo: 1 }, { foo: $in: [ 2, 3, 1, 4 ] }

      it 'should not match in', ->
        n { foo: 1 }, { foo: $in: [ 2, 3, 4 ] }

      it 'should match not in', ->
        y { foo: 1 }, { foo: $nin: [ 2, 3, 4 ] }

      it 'should not match not in', ->
        n { foo: 1 }, { foo: $nin: [ 1, 2 ] }

    describe 'element query ops', ->

      it 'should match existance', ->
        y { foo: bar: 1 }, { 'foo.bar': $exists: true }

      it 'should not match existance', ->
        n { foo: bar: 1 }, { 'foo.baz': $exists: true }

      it 'should not match negative existance', ->
        n { foo: bar: 1 }, { 'foo.bar': $exists: false }

      it 'should match negative existance', ->
        y { foo: bar: 1 }, { 'foo.baz': $exists: false }

      it 'should match number type', ->
        y { foo: bar: 1.2 }, { 'foo.bar': $type: 'number' }

      it 'should match boolean type', ->
        y { foo: bar: true }, { 'foo.bar': $type: 'boolean' }

      it 'should match string type', ->
        y { foo: bar: 'foo' }, { 'foo.bar': $type: 'string' }

      it 'should match object type', ->
        y { foo: bar: /foo/ }, { 'foo.bar': $type: 'object' }
        y { foo: bar: new Date() }, { 'foo.bar': $type: 'object' }

    describe 'evaluation ops', ->

      it 'should match modulo', ->
        y { foo: bar: 5 }, { 'foo.bar': $mod: [ 5, 0 ] }
        y { foo: bar: 5 }, { 'foo.bar': $mod: [ 3, 2 ] }
        y { foo: bar: 5 }, { 'foo.bar': $mod: [ 2, 1 ] }

      it 'should not match modulo', ->
        n { foo: bar: 5 }, { 'foo.bar': $mod: [ 5, 1 ] }
        n { foo: bar: 5 }, { 'foo.bar': $mod: [ 3, 3 ] }
        n { foo: bar: 5 }, { 'foo.bar': $mod: [ 2, 0 ] }




  it 'should not match eq', ->
    n { foo: 1 }, { foo: { $eq: 2 } }

  it 'should not match non existing eq', ->
    n { foo: 1 }, { 'foo2': { $eq: 1 } }

  it 'should work with simple $and', ->
    y { foo: bar: 1 }, { $and: [ { 'foo.bar': { $eq: 1 } }, { foo: $exists: true } ] }

  it 'should work with simple $exists false', ->
    n { foo: bar: 1 }, { 'foo.bar': $exists: false }

  it 'should work with simple $exists false 2', ->
    n { foo: bar: 1 }, { 'foo.baz': $exists: true }

  it 'should work with simple $exists false', ->
    y { foo: bar: 1 }, { 'foo.bar': $exists: true }

  it 'should not match lt', ->
    n { foo: bar: 123 }, { 'foo.bar': { $lt: 100 } }
