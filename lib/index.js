"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.test = test;
var ext_ = _interopRequire(require("./engine/ext"));

var mongo_ = _interopRequire(require("./engine/mongo"));

exports["default"] = mongo_;
function test(a, q) {
  return mongo_.test(a, q);
}

var ext = exports.ext = ext_;

var mongo = exports.mongo = mongo_;
Object.defineProperty(exports, "__esModule", {
  value: true
});