'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bar Schema
 */
var BarSchema = new Schema({
  name: String,
  yelpid: String,
  yelprating: Number,
  visitors: [ { type: String } ]
});

module.exports = mongoose.model('Bar', BarSchema);
