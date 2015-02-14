"use strict";

exports.rep = rep;
exports.array = array;
exports.object = object;
exports.date = date;
exports.regexp = regexp;
exports.none = none;
exports.args = args;
exports.buffer = buffer;


// Leaf is a value that we can't decend into.
exports.leaf = leaf;
function rep(a, b) {
  return Object.prototype.toString.call(a) === b;
}

function array(a) {
  return Array.isArray(a);
}

function object(a) {
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