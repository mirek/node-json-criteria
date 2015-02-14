"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var kvs = regeneratorRuntime.mark(function kvs(a) {
  var _iterator, _step, k;
  return regeneratorRuntime.wrap(function kvs$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!is.object(a)) {
          context$1$0.next = 9;
          break;
        }
        _iterator = Object.keys(a)[Symbol.iterator]();
      case 2:
        if ((_step = _iterator.next()).done) {
          context$1$0.next = 9;
          break;
        }
        k = _step.value;
        if (!a.hasOwnProperty(k)) {
          context$1$0.next = 7;
          break;
        }
        context$1$0.next = 7;
        return [k, a[k]];
      case 7:
        context$1$0.next = 2;
        break;
      case 9:
      case "end":
        return context$1$0.stop();
    }
  }, kvs, this);
});

// Decode query key from '_$foo' -> '$foo'. Encoding allows to refer to document attributes which would conflict with
// ops.
exports.decoded = decoded;


// Arrize path by splitting 'foo.bar' -> [ 'foo', 'bar' ], unless string starts with ' ' then
// ' foo.bar' -> [ 'foo.bar' ]
exports.split = split;


// # Resolve key path on an object.
// #
// # @example Example
// #   a = hello: in: nested: world: '!'
// #   console.log resolve a, 'hello.in.nested'
// #   # [ { nested: { world: '!' } }, [ 'nested' ] ]
// #
// # @param [Object] a An object to perform resolve on.
// # @param [String] path Key path.
// # @return [Array] [obj, path] tuple where obj is a resolved object and path an
// #   array with last component or multiple unresolved components.
exports.resolve = resolve;
exports.arrize = arrize;
exports.kvs = kvs;
var is = _interopRequireWildcard(require("./is"));

function decoded(qk) {
  var r = qk;
  if (qk[0] === "_" && qk[1] === "$") {
    r = qk.substr(1);
  }
  return r;
}function split(a) {
  var r = undefined;
  if (a[0] === " ") {
    r = [a.substring(1)];
  } else {
    r = a.split(".");
  }
  return r;
}function resolve(a, path) {
  var stack = split(path);
  var last = [];

  if (stack.length > 0) {
    last.unshift(stack.pop());
  }

  var e = a;
  var k = undefined;
  while (!is.none(k = stack.shift())) {
    if (!is.none(e[k])) {
      e = e[k];
    } else {
      stack.unshift(k);
      break;
    }
  }

  // Pull all unresolved components into last.
  while (!is.none(k = stack.pop())) {
    last.unshift(k);
  }

  return [e, last];
}

function arrize(a) {
  return Array.isArray(a) ? a : [a];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});