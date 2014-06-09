'use strict';

var Q = require('q');

exports.whenObject = whenObject;
function whenObject(obj) {
  if (obj === null || !~['function', 'object'].indexOf(typeof obj)) return Q(obj);
  var keys = Object.keys(obj);
  var pkeys = keys.filter(function (k) {
    return Q.isPromise(obj[k]);
  });
  var pvalues = pkeys.map(function (k) {
    return obj[k];
  });
  var cobj = keys.reduce(function (r, k) {
    r[k] = obj[k];
    return r;
  }, {});
  return Q.all(pvalues)
  .then(function (values) {
    values.forEach(function (v, i) {
      cobj[pkeys[i]] = v;
    });
    return cobj;
  })
}

exports.augmentResponse = function (resProto) {
  var _render = resProto.render;
  var _json = resProto.json;
  resProto.render = function (view, options, fn) {
    options = options || {};
    //
    // support callback function as second arg
    if ('function' == typeof options) {
      fn = options, options = {};
    }

    var that = this;
    Q.all([whenObject(that.locals), whenObject(options)])
    .spread(function (locals, opts) {
      that.locals = locals;
      _render.call(that, view, opts, fn);
    })
    .fail(that.req.next)
    .done();
  };
  resProto.json = function (obj) {
    var that = this;
    var a1 = Array.prototype.slice.call(arguments, 1);
    whenObject(obj)
    .then(function (robj) {
      _json.apply(that, [robj].concat(a1));
    })
    .fail(that.req.next)
    .done();
  };
};