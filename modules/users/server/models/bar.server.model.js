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
  name: {
    type: String
  },
  yelpid: {
    type: String
  },
  yelprating: {
    type: Number
  },
  visitors: [{
    type: String
  }]
});

module.exports = mongoose.model('Bar', BarSchema);
