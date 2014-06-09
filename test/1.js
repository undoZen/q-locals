'use strict';

var Q = require('q');
var assert = require('assert');
var express = require('express');
var request = require('supertest');

var ql = require('../');
//express.response = ql.augmentResponse(express.response);

describe('q-locals', function () {
  it('res.json', function (done) {
    var app = express();
    app.response = ql.augmentResponse(app.response);
    console.dir(app.response)
    console.log(app.response.render.toString());
    app.use(function (req, res, next) {
      res.json({
        p1: Q(1),
        p2: 2
      });
    });

    request(app)
    .get('/')
    .expect({
      p1:1,
      p2:2
    }, done);

  });
});
