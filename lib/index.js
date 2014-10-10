(function() {
  var ev, resolve,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  resolve = require('rus-diff').resolve;

  ev = function(d, q) {
    var dk, dvp, k, r, s, v;
    r = true;
    for (k in q) {
      v = q[k];
      s = (function() {
        var _ref;
        switch (k) {
          case '$and':
            return v.reduce((function(p, c) {
              return p && ev(d, c);
            }), true);
          case '$or':
            return v.reduce((function(p, c) {
              return p || ev(d, c);
            }), false);
          case '$nor':
            return v.reduce((function(p, c) {
              return p && !ev(d, c);
            }), true);
          case '$not':
            return !ev(d, v);
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
            return __indexOf.call(v, d) >= 0;
          case '$nin':
            return __indexOf.call(v, d) < 0;
          case '$exists':
            return !(v ^ (d != null));
          case '$type':
            return typeof d === v;
          case '$mod':
            return (d % v[0]) === v[1];
          case '$regex':
            return v.match(new RegExp(v, q.$options)) != null;
          case '$options':
            return true;
          case '$text':
            return false;
          case '$where':
            return v(d);
          default:
            _ref = resolve(d, k), dvp = _ref[0], dk = _ref[1];
            if (dk.length === 1) {
              return ev(dvp[dk[0]], v);
            } else {
              return ev(null, v);
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

  module.exports = {
    ev: ev
  };

}).call(this);
