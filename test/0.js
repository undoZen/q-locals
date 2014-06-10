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
  });
});
