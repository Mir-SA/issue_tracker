const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  id: String,
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: ''},
  created_on: Date,
  updated_on: Date,
  open: { type: Boolean, default: true },
  status_text: {type: String, default: ''},
}, {versionKey: false});

module.exports = issueSchema;