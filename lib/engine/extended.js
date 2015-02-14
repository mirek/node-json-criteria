"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.test = test;
var mongo = _interopRequire(require("./mongo"));

var extended = mongo.clone();
exports["default"] = extended;
function test(json, query) {
  return extended.test(json, query);
}

extended.append("conditions", "$typeof", function (a, b) {
  return typeof a === b;
});

extended.append("expansions", "$integer", { $typeof: "number", $mod: [1, 0] });
extended.append("expansions", "$natural", { $typeof: "number", $mod: [1, 0], $gte: 0 });
extended.append("expansions", "$email", { $typeof: "string", $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i });

extended.append("expansions", "$hex", { $typeof: "string", $regex: /^[0-9A-F]+$/i });
extended.append("expansions", "$string-object-id", { $typeof: "string", $regex: /^[0-9A-F]{24}$/i });
extended.append("expansions", "$object-id", { " $oid": { "$string-object-id": true } });

// $every
// $any
// $sorted
// $unique
// $type = array
// $date:format
// $date:iso
// $keys
// $exact / $iff
// $creditcard
// $guid
// $hostname http://tools.ietf.org/html/rfc1123
// $downcase
// $upcase
// $trim
//

extended.append("virtuals", "$length", function (a) {
  var r = undefined;
  if (a != null && a.hasOwnProperty("length")) {
    r = a.length;
  }
  return r;
});

var strftime = _interopRequireWildcard(require("../strftime"));

extended.append("conditions", "$strftime", function (a, b) {
  return strftime.test(b, a);
});

extended.append("expansions", "$date-iso", { $strftime: "%Y-%m-%dT%H:%M:%S%Z" });
Object.defineProperty(exports, "__esModule", {
  value: true
});