

export function rep (a, b) {
  return Object.prototype.toString.call(a) === b
}

export function array (a) {
  return Array.isArray(a)
}

export function object (a) {
  return typeof a === 'object' && a !== null
}

export function date (a) {
  return object(a) && rep(a, '[object Date]')
}

export function regexp (a) {
  return object(a) && rep(a, '[object RegExp]')
}

export function none (a) {
  return a == null
}

export function args (a) {
  return rep(a, '[object Arguments]')
}

export function buffer (a) {
  return Buffer != null ? Buffer.isBuffer(a) : false
}

// Leaf is a value that we can't decend into.
export function leaf (a) {
  let r = true
  switch (true) {
    case array(a) && a.length > 0:
    case object(a) && Object.keys(a).length > 0:
      r = false
      break
  }
  return r
}
