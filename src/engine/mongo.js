
import common from './common'

const mongo = common.clone()
export default mongo

export function test (json, query) {
  return mongo.test(json, query)
}

mongo.append('conditions', '$type', function (a, b) { return typeof(a) === b })
