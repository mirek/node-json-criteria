
## Summary [![Build Status](https://travis-ci.org/mirek/node-json-criteria.png?branch=master)](https://travis-ci.org/mirek/node-json-criteria)

Criteria queries on JSON objects Mongo style.

## Installation

    npm install json-criteria --save

On ES5 runtime, install also:

    npm install 6to5 --save

## Usage

Example:

    // In ES5 runtime at the entrypoint of your app, see http://6to5.org/docs/usage/polyfill/ for details.
    //
    //   require('6to5/polyfill')
    //
    // Use library with `/6to5` suffix:
    //
    //   var jc = require('json-criteria/6to5')

    var jc = require('json-criteria')
    console.log(jc.test({ foo: { bar: 123 } }, { 'foo.bar': { $eq: 123 } })) // true
    console.log(jc.test({ foo: { bar: 123 } }, { 'foo.bar': { $lt: 100 } })) // false

Criteria queries follow MongoDB convention. You can use operators described at http://docs.mongodb.org/manual/reference/operator/query

* logical ops
  * `{ $and: [ ... ] }` - all of
  * `{ $or: [ ... ] }` - any of
  * `{ $nor: [ ... ] }` - none of
  * `{ $not: ... }` - not, ie. `{ $not: { $gt: 0, $lt: 1 } }`
* comparison ops
  * `{ field: ... }` - is equal (implicit)
  * `{ field: { $eq: ... } }` - is equal (explicit)
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
  * `{ field: { $where: function (v) { return true/false } } }` - performs test using provided function, for security purposes function body as string is not supported
* array ops
  * `{ field: { $all: [ ... ] } }` - all of the values are in the field's value
  * `{ field: { $elemMatch: ... } }` - at least one element matches
  * `{ field: { $size: ... } }` - matches length of field's array value

For more examples have a look at specs.

# Example Use Case

Let's say you've got JSON based RESTful API that you want to test using mocha:

    // spec/spec-my-api.js

    var assert = require('assert')
    var request = require('request')
    var jc = require('json-criteria')
    var endpoint = 'http://localhost:3000/api/v1'

    function get (path, criteria) {
      return function (done) {
        request
          .get(endpoint + path)
          .end(function (err, resp) {
            assert.ifError(err)
            assert.ok(resp.body.count > 0)
            assert.ok(jc.test(resp.body, criteria))
            done(err)
          })
      }
    }

    describe('api', function () {

      it('should have zero users', get('users/count', { count: 0 }))

      it('should have empty user list', get('users', { users: { $size: 0 } }))

      it('should have 3 to 5 products', get('products', { 'meta.count': { $gt: 2, $lte: 5 } }))

      it('should have 3 products with meta count check', get('products', {
        $and: [
          { 'meta.count': 3 },
          { products: { $size: 3 } }
        ]
      }))

      it('should have shipped flag', get('orders/1', {
        tags: { $in: [ 'shipped' ] }
      }))

    })

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
