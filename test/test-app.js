"use strict";

const chai = require('chai');
const expect = chai.expect;

it("true should be true", function() {
  expect(true).to.equal(true);
})

var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var app = require('../index')

it("GET /", function(done) {
  chai.request(app)
    .get('/')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      done();
    });
});


// it("POST /austin", function(done) {
//   chai.request(app)
//     .post('/austin')
//     .end(function(err, res) {
//       expect(err).to.be.null;
//       expect(res).to.have.status(200);
//       done();
//     });
// });
