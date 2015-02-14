"use strict";

exports.rep = rep;
exports.symbol = symbol;
exports.number = number;
exports.undef = undef;
exports.func = func;
exports.boolean = boolean;
exports.error = error;
exports.string = string;
exports.array = array;
exports.i8array = i8array;
exports.u8array = u8array;
exports.u8carray = u8carray;


// TODO: rest from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects

exports.object = object;
exports.date = date;
exports.regexp = regexp;
exports.none = none;
exports.some = some;
exports.args = args;
exports.buffer = buffer;


// Leaf is a value that we can't decend into.
exports.leaf = leaf;
function rep(a, b) {
  return Object.prototype.toString.call(a) === b;
}

function symbol(a) {
  return rep(a, "[object Symbol]");
}

function number(a) {
  return rep(a, "[object Number]");
}

function undef(a) {
  return a === undefined;
}

function func(a) {
  return rep(a, "[object Function]");
}

function boolean(a) {
  return rep(a, "[object Boolean]");
}

function error(a) {
  return rep(a, "[object Error]");
}

function string(a) {
  return rep(a, "[object String]");
}

function array(a) {
  return Array.isArray(a);
}

function i8array(a) {
  return rep(a, "[object Int8Array]");
}

function u8array(a) {
  return rep(a, "[object Uint8Array]");
}

function u8carray(a) {
  return rep(a, "[object Uint8ClampedArray]");
}function object(a) {
  return typeof a === "object" && a !== null;
}

function date(a) {
  return object(a) && rep(a, "[object Date]");
}

function regexp(a) {
  return object(a) && rep(a, "[object RegExp]");
}

function none(a) {
  return a == null;
}

function some(a) {
  return a != null;
}

function args(a) {
  return rep(a, "[object Arguments]");
}

function buffer(a) {
  return Buffer != null ? Buffer.isBuffer(a) : false;
}function leaf(a) {
  var r = true;
  switch (true) {
    case array(a) && a.length > 0:
    case object(a) && Object.keys(a).length > 0:
      r = false;
      break;
  }
  return r;
}
Object.defineProperty(exports, "__esModule", {
  value: true
});