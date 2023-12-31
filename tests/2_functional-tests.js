const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue POST req to /api/issues/{project}', function(done) {
    chai.request(server)
    .post('/api/issues/apitest')
    .set('content-type', 'application/json')
    .send({
      issue_title: 'test',
      issue_text: 'test',
      created_by: 'test',
      assigned_to: 'test',
      status_text: 'test'
    })
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.equal(res.body.issue_title, 'test');
      assert.equal(res.body.issue_text, 'test');
      assert.equal(res.body.created_by, 'test');
      assert.equal(res.body.assigned_to, 'test');
      assert.equal(res.body.status_text, 'test');
      done();
    })
  });

  test('Create issue with missing required fields', function(done) {
    chai.request(server)
      .post('/api/issues/apitest')
      .set('content-type', 'application/json')
      .send({
        issue_title: 'test',
        issue_text: 'test',
      })
      .end(function(err, res){
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        done()
      })
  })
})