
import * as is from './is'

// Decode query key from '_$foo' -> '$foo'. Encoding allows to refer to document
// attributes which would conflict with ops.
export function decoded (qk) {
  let r = qk
  if (qk[0] === '_' && qk[1] === '$') {
    r = qk.substr(1)
  }
  return r
}

// Arrize path by splitting 'foo.bar' -> [ 'foo', 'bar' ], unless string starts
// with ' ' then ' foo.bar' -> [ 'foo.bar' ].
export function split (a) {
  let r = undefined
  if (a[0] === ' ') {
    r = [ a.substring(1) ]
  } else {
    r = a.split('.')
  }
  return r
}

// Resolve key path on an object.
export function resolve (a, path) {
  let stack = split(path)
  let last = []

  if (stack.length > 0) {
    last.unshift(stack.pop())
  }

  let e = a
  let k = undefined
  while (!is.none(k = stack.shift())) {
    if (!is.none(e[k])) {
      e = e[k]
    } else {
      stack.unshift(k)
      break
    }
  }

  // Pull all unresolved components into last.
  while (!is.none((k = stack.pop()))) {
    last.unshift(k)
  }

  return [ e, last ]
}

export function arrize (a) {
  return Array.isArray(a) ? a : [ a ]
}

export function* kvs (a) {
  if (is.object(a)) {
    for (let k of Object.keys(a)) {
      if (a.hasOwnProperty(k)) {
        yield [k, a[k]]
      }
    }
  }
}
