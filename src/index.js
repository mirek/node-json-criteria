
import ext_ from './engine/ext'
import mongo_ from './engine/mongo'

export default mongo_

export function test (a, q) {
  return mongo_.test(a, q)
}

export const ext = ext_

export const mongo = mongo_
