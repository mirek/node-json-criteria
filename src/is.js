

export function rep (a, b) {
  return Object.prototype.toString.call(a) === b
}

export function array (a) {
  return Array.isArray(a)
}

export function plain (a) {
  return object(a) && a.constructor === Object
}

export function object (a) {
  return typeof a === 'object' && a !== null
}

export function string (a) {
  return typeof a === 'string'
}

export function number (a) {
  return typeof a === 'number'
}

// Return true if value is an array with string elements only.
export function strings (a) {
  return array(a) && a.every((e) => string(e))
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
