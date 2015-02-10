

export function rep (a) {
  return Object.prototype.toString.call(a)
}

export function array (a) {
  return Array.isArray(a)
}

export function object (a) {
  return typeof a === 'object' && a !== null
}

export function date (a) {
  return object(a) && rep(a) === '[object Date]'
}

export function regexp (a) {
  return object(a) && rep(a) === '[object RegExp]'
}

export function nil (a) {
  return a == null
}

export function args (a) {
  return Object.prototype.toString.call(a) == '[object Arguments]'
}

export function buffer (a) {
  return Buffer != null ? Buffer.isBuffer(a) : false
}
