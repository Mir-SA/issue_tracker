'use strict';
const fs = require('fs')
const issueSchema = require('../db/models.js')
const express = require("express");
const mongoose = require('mongoose');
const router = new express.Router();

router.post('/api/issues/:project', async function(req, res) {
  const project = req.params.project;
  const Issue = mongoose.model('issue', issueSchema, project);

  const issue = new Issue({
    ...req.body,
    created_on: new Date(),
    updated_on: new Date(),
  });
  try {
    await issue.save();
    res.status(200).send(issue);
  } catch (err) {
    res.send({ error: 'required field(s) missing' });
  }
})

router.get('/api/issues/:project', async function(req, res) {
  const project = req.params.project;
  const query = req.query;
  const Issue = mongoose.model('issue', issueSchema, project);
  // console.log(project, req.query);

  try {
    const issues = await Issue.find(query);
    res.send(issues);
  } catch (err) {
    res.send(err);
  }
})

router.put('/api/issues/:project', async function(req, res) {
  const project = req.params.project;
  const _id = req.body._id;
  const updateData = {...req.body, updated_on: new Date()};
  const Issue = mongoose.model('issue', issueSchema, project);
  
  try {
    if(_id === undefined) {
      // console.log('no _id')
      res.send({ error: 'missing _id' });
    }
    if (_id) {
      // console.log(updateData);
      delete updateData._id;
      // console.log(updateData);

      // console.log(_id, Object.keys(req.body).length)
      if (Object.keys(req.body).length === 1) {
        // console.log('no update fields')
        res.send({ error: 'no update field(s) sent', '_id': _id });
      } else {
        const result = await Issue.findByIdAndUpdate(
          _id, 
          {$set: updateData}, 
          {new: true}
        )
       if( result === null) {
          res.send({ error: 'could not update', '_id': _id })
       } else {
          res.send({ result: 'successfully updated', '_id': _id })
       }
      }
    } 
  } catch (err) {
    // console.log('other error')
    res.send({ error: 'could not update', '_id': _id })
  }
})

router.delete('/api/issues/:project', async function(req, res) {
  const project = req.params.project;
  const _id = req.body._id;
  const Issue = mongoose.model('issue', issueSchema, project);

  try {
    if(_id === undefined){
      res.send({ error: 'missing _id' });
      // console.log('missing _id')
    } else {
      const result = await Issue.findByIdAndDelete(_id);
      if(result === null){
        res.send({ error: 'could not delete', '_id': _id })
      } else {
        res.send({ result: 'successfully deleted', '_id': _id });
      }
    } 
  } catch (err) {
      res.send({ error: 'could not delete', '_id': _id });
  }
})


// module.exports = function(app) {

//   app.route('/api/issues/:project')

//     .get(function(req, res) {
//       let project = req.params.project;
//       // console.log(project);
//       res.json(JSON.parse(data));
//     })

//     .post(async function(req, res) {
//       const issue = new Issue({
//           ...req.body,
//         created_on: new Date(),
//       });

//       try {
//           await issue.save();
//           res.status(201).send(issue);
//       } catch (err) {
//           res.status(400).send(err);
//       }
//     })

//     .put(function(req, res) {
//       let project = req.params.project;

//     })

//     .delete(function(req, res) {
//       let project = req.params.project;

//     });

// };

module.exports = router;