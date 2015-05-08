
import assert from 'assert'
import { minimize } from '../src'

let eq = (a, b) => assert.deepEqual(minimize(b), a)

describe('minimize', () => {

  it('should be the same', () => {
    eq({ foo: 1 }, { foo: 1})
  })

  it('should minimize more complex query', () => {
    eq({
      $and: [ { 'user.age': { $gt: 18 } } ],
      $nor: [ { 'user.where': 'USA' } ]
    }, {
      $or: [
        { 'user.gender': 'Male' },
        { 'user.age': { $gt: 18 } },
        { $nor: [ { 'dna.where': 'USA' } ] }
      ],
      $and: [
        { 'user.age': { $gt: 18 } },
        { $nor: [ { 'user.where': 'USA' } ] }
      ]
    })
  })

})
