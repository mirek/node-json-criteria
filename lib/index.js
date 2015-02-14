"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.test = test;
var extended_ = _interopRequire(require("./engine/extended"));

var mongo_ = _interopRequire(require("./engine/mongo"));

exports["default"] = extended_;
function test(a, q) {
  return extended_.test(a, q);
}

var extended = exports.extended = extended_;

var mongo = exports.mongo = mongo_;
Object.defineProperty(exports, "__esModule", {
  value: true
});