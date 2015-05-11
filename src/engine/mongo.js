
import Engine from '../engine'
import * as is from '../is'
import same from '../same'
import { arrize } from '../utils'
import * as ensure from '../ensure'

const mongo = new Engine()
export default mongo

export function test (json, query) {
  return mongo.test(json, query)
}

// Comparision

mongo.append2(require('../rules/eq'))
mongo.append2(require('../rules/ne'))
mongo.append2(require('../rules/gt'))
mongo.append2(require('../rules/gte'))
mongo.append2(require('../rules/lt'))
mongo.append2(require('../rules/lte'))
mongo.append2(require('../rules/in'))
mongo.append2(require('../rules/nin'))

// Logical

mongo.append2(require('../rules/or'))
mongo.append2(require('../rules/and'))
mongo.append2(require('../rules/nor'))
mongo.append2(require('../rules/not'))

// Element

mongo.append2(require('../rules/exists'))
mongo.append2(require('../rules/type'))

// Evaluation

mongo.append2(require('../rules/mod'))
mongo.append2(require('../rules/regex'))
mongo.append2(require('../rules/options')) // HACK
mongo.append2(require('../rules/where')) // TODO: Is it safe?

// Array

mongo.append2(require('../rules/all'))
mongo.append2(require('../rules/elem-match'))
mongo.append2(require('../rules/size'))
