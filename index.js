'use strict';

var Q = require('q');

exports = module.exports = augmentResponse;

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

exports.createResponse = createResponse;
function createResponse(resProto) {
  var _render = resProto.render;
  var _json = resProto.json;
  var res = Object.create(resProto);
  res.render = function (view, options, fn) {
    options = options || {};

    // support callback function as second arg
    if ('function' == typeof options) {
      fn = options, options = {};
    }

    var that = this;
    if (that.locals.qLocalsProcessed) return _render.call(that, view, options, fn);
    that.locals.qLocalsProcessed = true;
    Q.all([whenObject(that.locals), whenObject(options)])
    .spread(function (locals, opts) {
      that.locals = locals;
      _render.call(that, view, opts, fn);
    })
    .fail(that.req.next)
    .done();
  };
  res.json = function (obj) {
    var that = this;
    var a1 = Array.prototype.slice.call(arguments, 1);
    (Q.isPromise(obj) ? obj : whenObject(obj))
    .then(function (robj) {
      console.log(robj);
      _json.apply(that, [robj].concat(a1));
    })
    .fail(that.req.next)
    .done();
  };
  return res;
};

function augmentResponse(resProto) {
  if ('object' == typeof resProto.response) resProto = resProto.response;
  var res = createResponse(resProto);
  resProto.json = res.json;
  resProto.render = res.render;
}
