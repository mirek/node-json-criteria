
## Summary [![Build Status](https://travis-ci.org/mirek/node-json-criteria.png?branch=master)](https://travis-ci.org/mirek/node-json-criteria)

Invoke criteria queries in MongoDB format on JSON objects.

MongoDB implements flexible query format expressed in condensed JSON format. This package brings this functionality to nodejs.

## Installation

    npm install json-criteria --save

## Usage

Exported functions:

* `test(doc, crit)` - returns true/false
* `assert(doc, crit)` - throws if not matched

Example:

    var jc = require('json-criteria')
    console.log(jc.test({ foo: bar: 123 }, { 'foo.bar': { $eq: 123 } })) // true
    console.log(jc.test({ foo: bar: 123 }, { 'foo.bar': { $lt: 100 } })) // false

Criteria queries follow MongoDB convention. You can use operators described at http://docs.mongodb.org/manual/reference/operator/query

* logical ops
  * `{ $and: [ ... ] }` - all of
  * `{ $or: [ ... ] }` - any of
  * `{ $nor: [ ... ] }` - none of
  * `{ $not: ... }` - not, ie. `{ $not: { $gt: 0, $lt: 1 } }`
* comparison ops
  * `{ field: { $eq: ... } }` - is equal
  * `{ field: { $ne: ... } }` - is not equal
  * `{ field: { $gt: ... } }` - is greater than
  * `{ field: { $gte: ... } }` - is greater than or equal
  * `{ field: { $lt: ... } }` - is lower than
  * `{ field: { $lte: ... } }` - is lower than or equal
  * `{ field: { $in: [ ... ] } }` - at least one element matches value (or value's elements if array)
  * `{ field: { $nin: [ ... ] } }` - none of elements match value (or value's elements if array)
* element ops
  * `{ field: { $exists: true/false } }` - field exists
  * `{ field: { $type: 'number|string|...' } }` - matches field type
* evaluation ops
  * `{ field: { $mod: [ div, rem ] } }` - divided by div has reminder rem
  * `{ field: { $regexp: '...', $options: 'i' } }` - matches regular expression with optional options
  * `$text` - fts is not supported
  * `{ field: { $where: function (v) { return true/false } } }` - performs test using provided function, for security purposes function body as string is not supported
* geospatial ops - not supported atm
* array ops
  * `{ field: { $all: [ ... ] } }` - all of the values are in the field's value
  * `{ field: { $elemMatch: ... } }` - at least one element matches
  * `{ field: { $size: ... } }` - matches length of field's array value

Not supported:

* `{ filed: value }` - implicit equality is not supported, use: `{ field: { $eq: ... } }` explicit equality operator instead.

Example criteria queries:

| document            | criteria                            | result |
|---------------------|-------------------------------------|--------|
| { foo: bar: 'abc' } | { 'foo.bar': $exists: true }        | true   |
| { foo: bar: 'abc' } | { 'foo.baz': $exists: true }        | false  |
| { foo: bar: 'abc' } | { 'foo.bar': { $eq: 'abc' } }       | true   |
| { foo: bar: 1 }     | { 'foo.bar': { $gt: 0 } }           | true   |
| { foo: bar: 1 }     | { 'foo.bar': { $gt: 0, $lt: 1 } }   | false  |
| { foo: bar: 1 }     | { 'foo.bar': { $gt: 0, $lte: 1 } }  | true   |

For more examples have a look at specs.

# Example Use Case - Mocha API Specs

One example of good use case for this functionality is writing tests for API calls.

Let's say you've got JSON based RESTful API that you want to test using, let's say, mocha:

    # spec/spec-my-api.coffee

    assert = require 'assert'
    request = require 'request'
    endpoint = '...'

    describe 'my api', ->
      it 'should have zero users', (done) ->
        request
          .get "#{endpoint}/users/count"
          .end (err, resp) ->
            assert.ifError err
            assert.equal 0, resp.body?.count
            done err

You can use criteria query like this:

    # spec/spec-my-api.coffee

    assert = require 'assert'
    request = require 'request'
    jc = require 'json-criteria'
    endpoint = '...'

    describe 'my api', ->
      it 'should have zero users', (done) ->
        request
          .get "#{endpoint}/users/count"
          .end (err, resp) ->
            assert.ifError err
            assert.ok js.test resp.body, { count: $eq: 0 }
            done err

Not that much of a change, but because we're using more expressive criteria query language now, we can
refactor this test to it's own function with criteria parameter:

    # spec/spec-my-api.coffee

    assert = require 'assert'
    request = require 'request'
    jc = require 'json-criteria'
    endpoint = '...'

    get = (path, criteria, done) ->
      request
        .get "#{endpoint}/#{path}"
        .end (err, resp) ->
          assert.ifError err
          assert.ok jc.test resp.body, criteria
          done err

    describe 'my api', ->
      it 'should have zero users', (done) ->
        get 'users/count', { count: $eq: 0 }, done

We could stop here but if checking successul response structure is enough for our API test coverage we can refactor
our function so it returns a function object:

    # spec/spec-my-api.coffee

    assert = require 'assert'
    request = require 'request'
    jc = require 'json-criteria'
    endpoint = '...'

    get = (path, criteria) ->
      (done) ->
        request
          .get "#{endpoint}/#{path}"
          .end (err, resp) ->
            assert.ifError err
            assert.ok jc.test resp.body, criteria
            done err

    describe 'my api', ->
      it 'should have zero users', get 'users/count', { count: $eq: 0 }

Other tests can be often expressed in a single or just few lines now:

      it 'should have empty user list', get 'users', { users: $size: 0 }

      it 'should have 3 to 5 products', get 'products', { 'meta.count': { $gt: 2, $lte: 5 } }

      it 'should have 3 products with meta check', get 'products',
        $and: [
          { 'meta.count': { $eq: 3 } }
          { products: $size: 3 }
        ]

## License

    The MIT License (MIT)

    Copyright (c) 2014 Mirek Rusin http://github.com/mirek

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
