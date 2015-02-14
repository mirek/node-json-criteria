"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var is = _interopRequireWildcard(require("./is"));

var same = _interopRequire(require("./same"));

var _utils = require("./utils");

var kvs = _utils.kvs;
var resolve = _utils.resolve;
var decoded = _utils.decoded;
var Engine = (function () {
  function Engine() {
    var _ref = arguments[0] === undefined ? {} : arguments[0];
    var _ref$virtuals = _ref.virtuals;
    var virtuals = _ref$virtuals === undefined ? [] : _ref$virtuals;
    var _ref$conditions = _ref.conditions;
    var conditions = _ref$conditions === undefined ? [] : _ref$conditions;
    var _ref$expansions = _ref.expansions;
    var expansions = _ref$expansions === undefined ? [] : _ref$expansions;
    _classCallCheck(this, Engine);

    this.registry = { virtuals: virtuals, conditions: conditions, expansions: expansions };
  }

  _prototypeProperties(Engine, null, {
    clone: {
      value: function clone() {
        return new Engine({
          virtuals: this.registry.virtuals.slice(),
          conditions: this.registry.conditions.slice(),
          expansions: this.registry.expansions.slice()
        });
      },
      writable: true,
      configurable: true
    },
    append: {

      // freeze () {
      //   throw new Error('TODO')
      // }

      value: function append(t, k, f) {
        this.registry[t].push([k, f]);
      },
      writable: true,
      configurable: true
    },
    prepend: {
      value: function prepend(t, k, f) {
        this.registry[t].shift([k, f]);
      },
      writable: true,
      configurable: true
    },
    replace: {
      value: function replace(t, k, f) {
        var _rule = this.rule(k);

        var _rule2 = _slicedToArray(_rule, 1);

        var tk = _rule2[0];
        if (tk) {
          this.registry[tk][k] = f;
        } else {
          this.append(t, k, f);
        }
      },
      writable: true,
      configurable: true
    },
    rule: {

      // Find rule with k name.
      value: function rule(k) {
        var r = [undefined, undefined];
        for (var _iterator = kvs(this.registry)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
          var _step$value = _slicedToArray(_step.value, 2);

          var tk = _step$value[0];
          var tv = _step$value[1];
          for (var _iterator2 = tv[Symbol.iterator](), _step2; !(_step2 = _iterator2.next()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2);

            var rk = _step2$value[0];
            var rf = _step2$value[1];
            if (k === rk) {
              r = [tk, rf];
              break;
            }
          }
        }
        return r;
      },
      writable: true,
      configurable: true
    },
    test: {
      value: function test(d) {
        var q = arguments[1] === undefined ? {} : arguments[1];
        var r = true;

        // console.log('->', JSON.stringify({ d, q, leaf: is.leaf(q) }, null, '  '))

        if (is.leaf(q)) {
          r = r && this.test(d, { $eq: q });
        } else {
          for (var _iterator = kvs(q)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
            var _step$value = _slicedToArray(_step.value, 2);

            var qk = _step$value[0];
            var qv = _step$value[1];
            if (qk[0] === "$") {
              var _rule = this.rule(qk);

              var _rule2 = _slicedToArray(_rule, 2);

              var t = _rule2[0];
              var f = _rule2[1];


              // console.log('t>', t, f)

              switch (t) {
                case "expansions":
                  r = r && this.test(d, f);break;
                case "virtuals":
                  r = r && this.test(f.bind(this)(d, qv), qv);break;
                case "conditions":
                  r = r && f.bind(this)(d, qv, q);break;
                default:
                  throw new Error("Unknown rule " + qk);
              }

              if (r === false) {
                break;
              }
            } else {
              var tqk = decoded(qk); // Allow _$foo to reference $foo attributes.
              // console.log('d>', tqk)
              var _ref = resolve(d, tqk) || [];
              var _ref2 = _slicedToArray(_ref, 2);

              var dvp = _ref2[0];
              var dk = _ref2[1];
              if (dvp !== null && dk.length === 1) {
                // ...it's resolved
                r = r && this.test(dvp[dk[0]], qv);
              } else {
                r = r && this.test(undefined, qv) // we can still match `{ $exists: false }`, possibly in nested `{ $or: [] }`.
                ;
              }
            }
          }
        }

        // console.log('<-', JSON.stringify({ r, d, q }, null, '  '))

        return r;
      },
      writable: true,
      configurable: true
    }
  });

  return Engine;
})();

module.exports = Engine;