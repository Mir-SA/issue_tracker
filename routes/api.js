"use strict";
const fs = require("fs");
const issueSchema = require("../db/models.js");
const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();

router.post("/api/issues/:project", async function (req, res) {
  const project = req.params.project;
  const Issue = mongoose.model("issue", issueSchema, project);

  const issue = new Issue({
    ...req.body,
    created_on: new Date(),
    updated_on: new Date(),
  });
  try {
    await issue.save();
    res.status(200).send(issue);
  } catch (err) {
    res.send({ error: "required field(s) missing" });
  }
});

router.get("/api/issues/:project", async function (req, res) {
  const project = req.params.project;
  const query = req.query;
  const Issue = mongoose.model("issue", issueSchema, project);

  try {
    const issues = await Issue.find(query);
    res.send(issues);
  } catch (err) {
    res.send(err);
  }
});

router.put("/api/issues/:project", async function (req, res) {
  const project = req.params.project;
  const _id = req.body._id;
  const updateData = { ...req.body, updated_on: new Date() };
  const Issue = mongoose.model("issue", issueSchema, project);

  try {
    if (_id === undefined) {
      res.send({ error: "missing _id" });
    }
    if (_id) {
      delete updateData._id;

      if (Object.keys(req.body).length === 1) {
        res.send({ error: "no update field(s) sent", _id: _id });
      } else {
        const result = await Issue.findByIdAndUpdate(
          _id,
          { $set: updateData },
          { new: true }
        );
        if (result === null) {
          res.send({ error: "could not update", _id: _id });
        } else {
          res.send({ result: "successfully updated", _id: _id });
        }
      }
    }
  } catch (err) {
    res.send({ error: "could not update", _id: _id });
  }
});

router.delete("/api/issues/:project", async function (req, res) {
  const project = req.params.project;
  const _id = req.body._id;
  const Issue = mongoose.model("issue", issueSchema, project);

  try {
    if (_id === undefined) {
      res.send({ error: "missing _id" });
    } else {
      const result = await Issue.findByIdAndDelete(_id);
      if (result === null) {
        res.send({ error: "could not delete", _id: _id });
      } else {
        res.send({ result: "successfully deleted", _id: _id });
      }
    }
  } catch (err) {
    res.send({ error: "could not delete", _id: _id });
  }
});

module.exports = router;
