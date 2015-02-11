

// let a = /^([0-9]+|[a-z]+)/

// console.log('34js'.match(a))

// console.log('%Y-%m-%d'.substr(3, 2))

// console.log('abcdef'.substr(1))

import { test } from './engine/recommended'
import same from './same'

// console.log(test({ foo: { bar: '123' } }, { $and: [ { foo: { $exists: true } }, { 'foo.bar': { $eq: '123' } } ] }))
// console.log(test({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar: 2, foo: 1 } } }))

// import { deepEqual } from 'assert'
// console.log(same({ foo: 1, bar: 2 }, { bar: 2, foo: 1 }))
// ({ doc: { foo: 1, bar: 2 } }, { doc: { $eq: { bar: 2, foo: 1 } } })

// console.log(deepEqual(1, '1'))

// console.log(test({ foo: 1 }, { foo: { $in: [ 1 ] } }))
console.log(test(null, null))
