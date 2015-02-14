"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

exports.test = test;
function strsplice(a, i, n, b) {
  return a.slice(0, i) + (b || "") + str.slice(i + n);
}

var fmt = {

  // Day
  "%a": /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/,
  "%A": /(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)/,
  "%d": /(0[1-9]|[12][0-9]|3[01])/, // 01..31
  "%e": /( [1-9]|[12][0-9]|3[01])/, // _1..31
  "%j": /([0-2][0-9]{2}|3[0-5][0-9]|36[0-6])/,
  "%u": /([1-7])/, // 1..7
  "%w": /(0-6)/, // 0..6

  // Week
  "%U": /(0[0-9]|[1-4][0-9]|5[0-3])/, // 00..53
  "%V": /(0[1-9]|[1-4][0-9]|5[0-3])/, // 01..53
  "%W": /(0[0-9]|[1-4][0-9]|5[0-3])/, // 00..53

  // Month
  "%b": /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/,
  "%B": /(January|February|March|April|May|June|July|August|September|October|November|December)/,
  "%h": /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/,
  "%m": /(0[1-9]|1[0-2])/, // 01..12

  // Year
  "%C": /([0-9]{2})/, // 00..99
  "%g": /([0-9]{2})/, // 00..99
  "%G": /([0-9]{4})/, // 0000..9999
  "%y": /([0-9]{2})/, // 00..99
  "%Y": /([0-9]{4})/, // 0000..9999

  // Time
  "%H": /(0[0-9]|1[0-9]|2[0-3])/, // 00..23
  "%k": /( [0-9]|1[0-9]|2[0-3])/, // _0..23
  "%I": /(0[1-9]|1[0-2])/, // 01..12
  "%l": /( [1-9]|1[0-2])/, // _1..12
  "%M": /([0-5][0-9])/, // 00..59
  "%p": /(AM|PM)/,
  "%P": /(am|pm)/,
  "%r": "%I:%M:%S %p",
  "%R": "%H:%M",
  "%S": /([0-5][0-9])/,
  "%T": /%H:%M:%S/,
  "%X": /%H:%M:%S/,
  "%z": /([+-][0-9]{4}|)/,
  "%Z": /([A-Z]+)/,

  // Time and Date Stamps
  // %c not supported.
  "%D": "%m/%d/%y",
  "%F": "%Y-%m-%d",
  "%s": /([0-9]+)/,
  // %x not supported.

  // Misc
  "%n": /\n/,
  "%t": /\t/,
  "%%": /\%/
};

// Maximum format string length.
var max = 1023;

function test_(f, d) {
  var r = false;

  var i = 0;
  var j = 0;
  var err = null;

  if (typeof f === "string" && typeof d === "string" && f.length < max) {
    r = true;
    while (r && i < f.length && j < d.length) {
      if (f[i] === "%") {
        var t = f.substr(i, 2);
        // console.log('t', t, f, i)
        var u = fmt[t];
        if (u) {
          if (typeof u === "string") {
            // fmt rule is a string, expand, ie. '%F' -> '%Y-%m-%d'.
            f = strsplice(f, 0, 2, u);
          } else {
            var m = d.substr(j).match(fmt[t]);
            if (m) {
              // console.log('matched', t)
              i += 2;j += m[0].length;
            } else {
              var _ref = [new Error("invalid input for " + t), false];

              var _ref2 = _slicedToArray(_ref, 2);

              err = _ref2[0];
              r = _ref2[1];
            }
          }
        } else {
          var _ref3 = [new Error("unknown token " + t), false];

          var _ref32 = _slicedToArray(_ref3, 2);

          err = _ref32[0];
          r = _ref32[1];
        }
      } else {
        if (f[i] === d[j]) {
          // console.log('++', f[i])
          i++;j++;
        } else {
          var _ref4 = [new Error("direct match failed " + f[i] + " != " + d[j]), false];

          var _ref42 = _slicedToArray(_ref4, 2);

          err = _ref42[0];
          r = _ref42[1];
        }
      }
    }
    if (r) {
      if (i !== f.length) {
        var _ref5 = [new Error("invalid extras"), false];

        var _ref52 = _slicedToArray(_ref5, 2);

        err = _ref52[0];
        r = _ref52[1];
      }
      if (j !== d.length) {
        var _ref6 = [new Error("not fully matched"), false];

        var _ref62 = _slicedToArray(_ref6, 2);

        err = _ref62[0];
        r = _ref62[1];
      }
    }
  }

  return [err, r, i, j];
}

function test(a, b) {
  var _test_ = test_(a, b);

  var _test_2 = _slicedToArray(_test_, 4);

  var err = _test_2[0];
  var r = _test_2[1];
  var i = _test_2[2];
  var j = _test_2[3];
  return r;
}

// let f = '%Y-%m-%d'
// let d = '2004-10-11'
// console.log(test(f, d))
Object.defineProperty(exports, "__esModule", {
  value: true
});