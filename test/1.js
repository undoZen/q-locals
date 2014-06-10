'use strict';

var Q = require('q');
var path = require('path');
var assert = require('assert');
var express = require('express');
var request = require('supertest');

var ql = require('../');
//express.response = ql.augmentResponse(express.response);
//
function testApp(app, done) {

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.get('/json',
    function (req, res, next) {
      res.json({
        p1: Q(1),
        p2: 2
      });
    });

  app.get('/render',
    function (req, res, next) {
      res.render('render', {
        hello: Q('Hello, '),
        world: 'World!'
      });
    });

  var count = 2;
  var allDone = function(err) {
    if (err) {
      allDone = function () {};
      done(err);
      return;
    }
    --count || done();
  }

  request(app)
  .get('/json')
  .expect({
    p1:1,
    p2:2
  }, allDone);

  request(app)
  .get('/render')
  .expect('<span>Hello, </span><strong>World!</strong>', allDone)

}

describe('q-locals app', function () {
  it('createResponse', function (done) {
    var app = express();
    app.response = ql.createResponse(app.response);
    testApp(app, done);
  });
  it('augmentResponse(app)', function (done) {
    var app = express();
    ql(app);
    testApp(app, done);
  });
  it('augmentResponse(express)', function (done) {
    ql(express);
    var app = express();
    testApp(app, done);
  });
});
