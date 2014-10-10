
{ resolve } = require 'rus-diff'

ev = (d, q) ->
  r = true
  for k, v of q
    s = switch k

      # Logical ops
      when '$and' then v.reduce ((p, c) -> p and ev(d, c)), true
      when '$or' then v.reduce ((p, c) -> p or ev(d, c)), false
      when '$nor' then v.reduce ((p, c) -> p and not ev(d, c)), true
      when '$not' then not ev(d, v)

      # Comparision ops
      when '$eq' then d is v
      when '$ne' then d isnt v
      when '$lt' then d < v
      when '$lte' then d <= v
      when '$gt' then d > v
      when '$gte' then d >= v
      when '$in' then d in v
      when '$nin' then d not in v

      # Element query ops
      when '$exists' then not (v ^ d?)
      when '$type' then d typeof v # TODO: do it right

      # Evaluation query ops
      when '$mod' then d % v[0] is v[1]
      when '$regex' then v.match(new RegExp(v, q.$options))?
      when '$options' then true # HACK

      when '$text' then false
      when '$where' then v d # TODO: security

      # TODO: Geospatial ops
      # TODO: Array query ops

      else
        [ dvp, dk ] = resolve d, k
        if dk.length is 1 # ...is resolved
          ev dvp[dk[0]], v
        else
          ev null, v # we can match $exists false.

    # console.log JSON.stringify { k, v, q, r, s }

    r = r and s

    break unless r
  r

module.exports = {
  ev
}
