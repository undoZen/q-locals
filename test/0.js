'use strict';

var Q = require('q');
var assert = require('assert');

describe('whenObject', function () {
  it('resolve object properties', function (done) {
    var p1 = Q.promise(function (resolve) {
      setTimeout(resolve, 200, 1);
    });
    var p2 = Q.promise(function (resolve) {
      setTimeout(resolve, 500, 2);
    });
    require('../').whenObject({
      p1: p1,
      p2: p2,
      p3: Q(3),
      p4: 4
    })
    .then(function (obj) {
      assert.deepEqual(obj, {
        p1: 1,
        p2: 2,
        p3: 3,
        p4: 4
      });
      done();
    })
  });
});
