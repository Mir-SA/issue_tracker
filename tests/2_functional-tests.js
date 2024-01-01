const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require("mongoose");
let total; // for GET req #1
let del_id; // for DELETE req #1

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST requests", function () {
    test("Create an issue POST req to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "test",
          issue_text: "test",
          created_by: "test",
          assigned_to: "test",
          status_text: "test",
        })
        .end(function (err, res) {
          del_id = res.body._id;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test");
          assert.equal(res.body.issue_text, "test");
          assert.equal(res.body.created_by, "test");
          assert.equal(res.body.assigned_to, "test");
          assert.equal(res.body.status_text, "test");
          done();
        });
    });

    test("Create issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "test",
          issue_text: "test",
          created_by: "test",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test");
          assert.equal(res.body.issue_text, "test");
          assert.equal(res.body.created_by, "test");
          done();
        });
    });

    test("Create issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "test",
          issue_text: "test",
        })
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET requests", function () {
    mongoose.connection
      .collection("apitest")
      .countDocuments({}, (err, count) => {
        if (err) console.log(err);
        total = count + 2;
      });

    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, total);
          done();
        });
    });

    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=me")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          done();
        });
    });

    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=me&open=false")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          done();
        });
    });
  });

  suite("PUT requests", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "658faa11840030ed50b0f62b",
          open: false,
        })
        .end(function (err, res) {
          assert.property(res.body, "result");
          assert.property(res.body, "_id");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "658faa11840030ed50b0f62b");
          done();
        });
    });

    test("Update multiple field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "658faa11840030ed50b0f62b",
          open: false,
          status_text: "done",
        })
        .end(function (err, res) {
          assert.property(res.body, "result");
          assert.property(res.body, "_id");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "658faa11840030ed50b0f62b");
          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          open: false,
          status_text: "done",
        })
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "658fea709083fc59d05e671f",
        })
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.property(res.body, "_id");
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, "658fea709083fc59d05e671f");
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "abc123",
          issue_title: "update",
          issue_text: "update text",
        })
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.property(res.body, "_id");
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "abc123");
          done();
        });
    });
  });

  suite("DELETE requests", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: del_id,
        })
        .end(function (err, res) {
          assert.property(res.body, "result");
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, del_id);
          done();
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: "12345",
        })
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "12345");
          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.property(res.body, "error");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
