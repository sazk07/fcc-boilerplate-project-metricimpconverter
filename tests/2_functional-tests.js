const chaiHttp = require('chai-http');
const chai = require('chai');
let { assert } = chai
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing Tests', function () {
    suite('GET /api/convert => conversion object', function () {
      test('Convert 10L (valid input)', function (done) {
        chai.request(server)
        .get('/api/convert')
        .query({ input: '10L' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.initNum, 10)
          assert.equal(res.body.initUnit, 'L')
          assert.approximately(res.body.returnNum, 2.64, 0.01)
          assert.equal(res.body.returnUnit, 'gal')
          done()
        })
      })
      test('Convert 32g (invalid input)', function (done) {
        chai.request(server)
        .get('/api/convert')
        .query({ input: '32g' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'invalid unit')
          done()
        })
      })
      test('Convert 3/7.2/4kg (invalid number)', function (done) {
        chai.request(server)
        .get('/api/convert')
        .query({ input: '3/7.2/4kg' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'invalid number')
          done()
        })
      })
      test('Convert 3/7.2/4kilomemagram (invalid number and unit)', function (done) {
        chai.request(server)
        .get('/api/convert')
        .query({ input: '3/7.2/4kilomemagram' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'invalid number and unit')
          done()
        })
      })
      test('Convert kg with no numbers', function (done) {
        chai.request(server)
        .get('/api/convert')
        .query({ input: 'kg' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.initNum, 1)
          assert.equal(res.body.initUnit, 'kg')
          assert.approximately(res.body.returnNum, 2.2, 0.1)
          assert.equal(res.body.returnUnit, 'lbs')
          done()
        })
      })
    })
  })
});
