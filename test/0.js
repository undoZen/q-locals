'use strict';

var Q = require('q');
var assert = require('assert');

describe('whenObject', function () {
  it('resolve object properties', function (done) {
    require('../').whenObject({
      p3: Q(3),
      p4: 4
    })
    .then(function (obj) {
      assert.deepEqual(obj, {
        p3: 3,
        p4: 4
      });
      done();
    })
    .done();
  });
  it('resolve array elements', function (done) {
    require('../').whenObject([
      Q(3),
      4
    ])
    .then(function (obj) {
      assert(Array.isArray(obj));
      assert.deepEqual(obj, [
        3,
        4
      ]);
      done();
    })
    .done();
  });
});
