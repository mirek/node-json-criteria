
import Engine from '../engine'
import * as is from '../is'
import same from '../same'
import { arrize } from '../utils'

const common = new Engine()
export default common

export function test (json, query) {
  return common.test(json, query)
}

// Comparision

common.append('conditions', '$eq', function (a, b) { return same(a, b) } )
common.append('conditions', '$gt', function (a, b) { return a > b } )
common.append('conditions', '$gte', function (a, b) { return a >= b } )
common.append('conditions', '$lt', function (a, b) { return a < b } )
common.append('conditions', '$lte', function (a, b) { return a <= b } )
common.append('conditions', '$ne', function (a, b) { return !same(a, b) } )
common.append('conditions', '$in', function (a, b) { let aa = arrize(a); return arrize(b).some((e) => aa.indexOf(e) >= 0) } )
common.append('conditions', '$nin', function (a, b) { let aa = arrize(a); return arrize(b).every((e) => aa.indexOf(e) < 0) } )

// Logical

common.append('conditions', '$or', function (a, b) { return b.reduce(((p, c) => p || this.test(a, c)), false) })
common.append('conditions', '$and', function (a, b) { return b.reduce(((p, c) => p && this.test(a, c)), true) })
common.append('conditions', '$not', function (a, b) { return !this.test(a, b) })
common.append('conditions', '$nor', function (a, b) { return b.reduce(((p, c) => p && !this.test(a, c)), true) })

// Element

common.append('conditions', '$exists', function (a, b) { return !((!!b) ^ !is.none(a)) })
// $type

// Evaluation

common.append('conditions', '$mod', function (a, b) { return (a % b[0]) === b[1] } )
common.append('conditions', '$regex', function (a, b, c) { return !!a.match(new RegExp(b, c.$options)) } )
common.append('expansions', '$options', true ) // TODO: FIXME: HACK:
// $text
common.append('conditions', '$where', function (a, b, c) { return b(a) } )

// Geospatial

// $geoWithin
// $geoIntersects
// $near
// $nearSphere

// Array

common.append('conditions', '$all', function (a, b) { return is.array(a) && is.array(b) && b.every((e) => a.indexOf(e) >= 0) } )
common.append('conditions', '$elemMatch', function (a, b) { return is.array(a) && a.some((e) => this.test(e, b)) } )
common.append('conditions', '$size', function (a, b) { return b === (is.array(a) ? a.length : 0) } )
