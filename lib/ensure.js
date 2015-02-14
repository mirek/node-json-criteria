"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.array = array;
var is = _interopRequireWildcard(require("./is"));

function array(a) {
  if (!is.array(a)) throw new TypeError("Expected array, got " + typeof a + ".");
}
Object.defineProperty(exports, "__esModule", {
  value: true
});