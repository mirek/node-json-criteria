(function() {
  var arrize, assert, assert_, isScalar, pre, resolve, test,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  resolve = require('rus-diff').resolve;

  assert = require('assert');

  isScalar = function(v) {
    var _ref;
    return (v === null) || ((_ref = typeof v) === 'string' || _ref === 'number' || _ref === 'boolean');
  };

  arrize = function(a) {
    if (Array.isArray(a)) {
      return a;
    } else {
      return [a];
    }
  };

  test = function(d, q) {
    var da, dk, dvp, k, r, s, v;
    r = true;
    for (k in q) {
      v = q[k];
      s = (function() {
        var _ref;
        switch (k) {
          case '$and':
            return v.reduce((function(p, c) {
              return p && test(d, c);
            }), true);
          case '$or':
            return v.reduce((function(p, c) {
              return p || test(d, c);
            }), false);
          case '$nor':
            return v.reduce((function(p, c) {
              return p && !test(d, c);
            }), true);
          case '$not':
            return !test(d, v);
          case '$eq':
            return d === v;
          case '$ne':
            return d !== v;
          case '$lt':
            return d < v;
          case '$lte':
            return d <= v;
          case '$gt':
            return d > v;
          case '$gte':
            return d >= v;
          case '$in':
            da = arrize(d);
            return v.some(function(e) {
              return __indexOf.call(da, e) >= 0;
            });
          case '$nin':
            da = arrize(d);
            return v.every(function(e) {
              return __indexOf.call(da, e) < 0;
            });
          case '$exists':
            return !(v ^ (d != null));
          case '$type':
            return typeof d === v;
          case '$mod':
            return (d % v[0]) === v[1];
          case '$regex':
            return d.match(new RegExp(v, q.$options)) != null;
          case '$options':
            return true;
          case '$text':
            return false;
          case '$where':
            return v(d);
          case '$all':
            da = arrize(d);
            return v.every(function(e) {
              return __indexOf.call(da, e) >= 0;
            });
          case '$elemMatch':
            return Array.isArray(d) && d.some(function(e) {
              return test(e, v);
            });
          case '$size':
            return v === (Array.isArray(d) ? d.length : 0);
          default:
            if (k[0] !== '$') {
              _ref = resolve(d, k), dvp = _ref[0], dk = _ref[1];
              if ((dvp != null) && dk.length === 1) {
                if (isScalar(v)) {
                  v = {
                    $eq: v
                  };
                }
                return test(dvp[dk[0]], v);
              } else {
                return test(null, v);
              }
            } else {
              throw new Error("" + k + " operator is not supported.");
            }
        }
      })();
      r = r && s;
      if (!r) {
        break;
      }
    }
    return r;
  };

  assert_ = function(d, q) {
    return assert.equal(true, test(d, q));
  };

  pre = function(args, cond, errcb) {
    var err;
    if (test(args, cond)) {
      return null;
    } else {
      err = new Error("Unmet precondition");
      if (errcb != null) {
        errcb(err);
      }
      return err;
    }
  };

  module.exports = {
    assert: assert_,
    pre: pre,
    test: test
  };

}).call(this);
