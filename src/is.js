

export function rep (a, b) {
  return Object.prototype.toString.call(a) === b
}

export function symbol (a) {
  return rep(a, '[object Symbol]')
}

export function number (a) {
  return rep(a, '[object Number]')
}

export function undef (a) {
  return a === undefined
}

export function func (a) {
  return rep(a, '[object Function]')
}

export function boolean (a) {
  return rep(a, '[object Boolean]')
}

export function error (a) {
  return rep(a, '[object Error]')
}

export function string (a) {
  return rep(a, '[object String]')
}

export function array (a) {
  return Array.isArray(a)
}

export function i8array (a) {
  return rep(a, '[object Int8Array]')
}

export function u8array (a) {
  return rep(a, '[object Uint8Array]')
}

export function u8carray (a) {
  return rep(a, '[object Uint8ClampedArray]')
}

// TODO: rest from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects

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

export function some (a) {
  return a != null
}

export function args (a) {
  return rep(a, '[object Arguments]')
}

export function buffer (a) {
  return Buffer != null ? Buffer.isBuffer(a) : false
}
