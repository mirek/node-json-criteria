
## Summary [![Build Status](https://travis-ci.org/mirek/node-json-criteria.png?branch=master)](https://travis-ci.org/mirek/node-json-criteria)

## Installation

    npm install json-criteria --save

## Usage

Currently we're exposing single function `ev(doc, query)` which returns true on match and false otherwise.

    var ev = require('json-criteria').ev
    console.log(ev({ foo: bar: 123 }, { 'foo.bar': { $eq: 123 } })) # true
    console.log(ev({ foo: bar: 123 }, { 'foo.bar': { $lt: 100 } })) # false

For more examples have a look at specs.

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
