
assert = require 'assert'
$ = require '../src'

describe 'ev', ->

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
