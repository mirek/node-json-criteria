
{ resolve } = require 'rus-diff'
assert = require 'assert'

arrize = (a) -> if Array.isArray(a) then a else [ a ]

# @param [Object] d Document
# @param [Object] q Criteria query in MongoDB format
# @return [Boolean] true on match, false otherwise
test = (d, q) ->
  r = true
  for k, v of q
    s = switch k

      # Logical ops
      when '$and' then v.reduce ((p, c) -> p and test(d, c)), true
      when '$or' then v.reduce ((p, c) -> p or test(d, c)), false
      when '$nor' then v.reduce ((p, c) -> p and not test(d, c)), true
      when '$not' then not test(d, v)

      # Comparison ops
      when '$eq' then d is v
      when '$ne' then d isnt v
      when '$lt' then d < v
      when '$lte' then d <= v
      when '$gt' then d > v
      when '$gte' then d >= v
      when '$in' then da = arrize(d); v.some (e) -> e in da
      when '$nin' then da = arrize(d); v.every (e) -> e not in da

      # Element query ops
      when '$exists' then not (v ^ d?)
      when '$type' then typeof d is v # TODO: do it right

      # Evaluation query ops
      when '$mod' then (d % v[0]) is v[1]
      when '$regex' then d.match(new RegExp(v, q.$options))?
      when '$options' then true # HACK
      when '$text' then false
      when '$where' then v d # TODO: security

      # TODO: Geospatial ops

      # Array query ops
      when '$all' then da = arrize(d); v.every (e) -> e in da
      when '$elemMatch' then Array.isArray(d) and d.some (e) -> test(e, v)
      when '$size' then v is (if Array.isArray(d) then d.length else 0)

      else
        unless k[0] is '$'
          [ dvp, dk ] = resolve d, k
          if dvp? and dk.length is 1 # ...is resolved
            test dvp[dk[0]], v
          else
            test null, v # we can match $exists false.
        else
          throw new Error "#{k} operator is not supported."

    # console.log JSON.stringify { k, v, q, r, s }

    r = r and s

    break unless r
  r

# @param [Object] d Document
# @param [Object] q Criteria query in MongoDB format
assert_ = (d, q) ->
  assert.equal true, test d, q

pre = (args, cond, errcb) ->
  if test args, cond
    null
  else
    err = new Error "Unmet precondition"
    errcb err if errcb?
    err

module.exports = {
  assert: assert_
  pre
  test
}
