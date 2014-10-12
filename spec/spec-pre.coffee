
assert = require 'assert'
$ = require '../src'

describe 'pre', ->

  f = (req) ->
    throw err if err = $.pre { req }, { 'req.query.foo': { $gt: 0, $lt: 3 } }
    req.query.foo + 1

  it 'should work with sync function', ->
    assert.equal 2, f { query: foo: 1 }

  it 'should throw for sync function', ->
    assert.throws -> f(query: foo: 0)
    assert.throws -> f(query: foo: 3)
