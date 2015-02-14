"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// Return true if arrays are the same.
exports.arrays = arrays;


// Return true if two values are the same.
exports["default"] = same;
var is = _interopRequireWildcard(require("./is"));

function arrays(a, b) {
  var sort = arguments[2] === undefined ? false : arguments[2];
  var r = true;
  var an = a.length;
  var bn = b.length;
  if (an === bn) {
    if (sort) {
      a.sort();
      b.sort();
    }
    for (var i = 0; i < an; i++) {
      if (a[i] !== b[i]) {
        r = false;
        break;
      }
    }
  } else {
    r = false;
  }
  return r;
}function same(a, b) {
  var r = false;
  switch (true) {

    // Same scalars.
    case a === b:
      r = true;
      break;

    // Objects.
    case is.object(a) && is.object(b):
      switch (true) {

        // Dates.
        case is.date(a) && is.date(b):
          r = a.getTime() === b.getTime();
          break;

        // RegExps.
        case is.regexp(a) && is.regexp(b):
          r = a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.lastIndex === b.lastIndex && a.ignoreCase === b.ignoreCase;
          break;

        // Array like.
        case is.array(a) && is.array(b):
        case is.args(a) && is.args(b):
        case is.buffer(a) && is.buffer(b):
          r = arrays(a, b);
          break;

        // Other objects.
        default:
          var aks = Object.keys(a);
          var bks = Object.keys(b);
          if (arrays(aks, bks, true)) {
            r = aks.every(function (k) {
              return same(a[k], b[k]);
            });
          }
          break;
      }
      break;
  }
  return r;
}
Object.defineProperty(exports, "__esModule", {
  value: true
});