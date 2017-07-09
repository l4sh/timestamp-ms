'use strict';

var request = require('supertest');
var test = require('tape');

process.env.NODE_NO_WARNINGS = true;

var app = require('../index.js');

test('Test natural date', function(assert) {
  request(app)
    .get('/December%2015,%202015')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var expected = {unix: 1450137600, natural: 'December 15, 2015'}
      var actual = res.body;

      assert.error(err, 'No error on request');
      assert.same(actual, expected, 'Retrieve date and timestamp');
      assert.end();
    });
});


test('Test unix timestamp', function(assert) {
  request(app)
    .get('/1450137600')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var expected = {unix: 1450137600, natural: 'December 15, 2015'};
      var actual = res.body;

      assert.error(err, 'No error on request');
      assert.same(actual, expected, 'Retrieve date and timestamp');
      assert.end();
    });
});


test('Test unknown values', function(assert) {
  request(app)
    .get('/not-a-date-or-timestamp')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      var expected = {unix: null, natural: null};
      var actual = res.body;

      assert.error(err, 'No error on request');
      assert.same(actual, expected, 'Retrieve unknown values');
      assert.end();
    });
});

