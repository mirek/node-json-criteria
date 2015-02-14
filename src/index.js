
import extended_ from './engine/extended'
import mongo_ from './engine/mongo'

export default extended_

export function test (a, q) {
  return extended_.test(a, q)
}

export const extended = extended_

export const mongo = mongo_
