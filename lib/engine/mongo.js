"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.test = test;
var Engine = _interopRequire(require("../engine"));

var is = _interopRequireWildcard(require("../is"));

var same = _interopRequire(require("../same"));

var arrize = require("../utils").arrize;
var ensure = _interopRequireWildcard(require("../ensure"));

var mongo = new Engine();
exports["default"] = mongo;
function test(json, query) {
  return mongo.test(json, query);
}

// Comparision

mongo.append("conditions", "$eq", function (a, b) {
  return same(a, b);
});
mongo.append("conditions", "$gt", function (a, b) {
  return a > b;
});
mongo.append("conditions", "$gte", function (a, b) {
  return a >= b;
});
mongo.append("conditions", "$lt", function (a, b) {
  return a < b;
});
mongo.append("conditions", "$lte", function (a, b) {
  return a <= b;
});
mongo.append("conditions", "$ne", function (a, b) {
  return !same(a, b);
});

mongo.append("conditions", "$in", function (a, b) {
  var a_ = arrize(a);
  return arrize(b).some(function (e) {
    return a_.indexOf(e) >= 0;
  });
});

mongo.append("conditions", "$nin", function (a, b) {
  var aa = arrize(a);
  return arrize(b).every(function (e) {
    return aa.indexOf(e) < 0;
  });
});

// Logical

mongo.append("conditions", "$or", function (a, b) {
  var _this = this;
  ensure.array(b);
  return b.reduce(function (p, c) {
    return p || _this.test(a, c);
  }, false);
});

mongo.append("conditions", "$and", function (a, b) {
  var _this = this;
  ensure.array(b);
  return b.reduce(function (p, c) {
    return p && _this.test(a, c);
  }, true);
});

mongo.append("conditions", "$not", function (a, b) {
  return !this.test(a, b);
});

mongo.append("conditions", "$nor", function (a, b) {
  var _this = this;
  ensure.array(b);
  return b.reduce(function (p, c) {
    return p && !_this.test(a, c);
  }, true);
});

// Element

mongo.append("conditions", "$exists", function (a, b) {
  return !(!!b ^ !is.none(a));
});

mongo.append("conditions", "$type", function (a, b) {
  return typeof a === b;
});

// Evaluation

mongo.append("conditions", "$mod", function (a, b) {
  return a % b[0] === b[1];
});

mongo.append("conditions", "$regex", function (a, b, c) {
  return !!a.match(new RegExp(b, c.$options));
});

// HACK: $options referenced from $regex
mongo.append("conditions", "$options", function () {
  return true;
});

mongo.append("conditions", "$where", function (a, b, c) {
  // ensure.func(b)
  return b(a);
});

// Geospatial

// TODO: $geoWithin
// TODO: $geoIntersects
// TODO: $near
// TODO: $nearSphere

// Array

mongo.append("conditions", "$all", function (a, b) {
  return is.array(a) && is.array(b) && b.every(function (e) {
    return a.indexOf(e) >= 0;
  });
});

mongo.append("conditions", "$elemMatch", function (a, b) {
  var _this = this;
  return is.array(a) && a.some(function (e) {
    return _this.test(e, b);
  });
});

mongo.append("conditions", "$size", function (a, b) {
  return b === (is.array(a) ? a.length : 0);
});
Object.defineProperty(exports, "__esModule", {
  value: true
});