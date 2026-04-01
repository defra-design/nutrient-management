var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');
var SUCCESS = require('./success_messages.js');
var { LIVESTOCK_INVENTORY_IN_PROGRESS, LIVESTOCK_INVENTORY_COMPLETE, LIVESTOCK_INVENTORY_NO_LIVESTOCK } = require('./constants.js');

// =====================================
// REPORTS
// Routes for manure storage requirement
// =====================================


module.exports = router