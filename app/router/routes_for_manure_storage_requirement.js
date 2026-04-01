var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');
var SUCCESS = require('./success_messages.js');
var { LIVESTOCK_INVENTORY_IN_PROGRESS, LIVESTOCK_INVENTORY_COMPLETE, LIVESTOCK_INVENTORY_NO_LIVESTOCK } = require('./constants.js');

// =====================================
// Routes for manure storage requirement
// =====================================

// farm_area_question_router - req.session.data.farm.area_added = true > checklist
router.get(/farm_area_question_router/, function (req, res) {
  let next = 'checklist'
  req.session.data.farm.area_added = true
  res.redirect(next)
})

// rain_water_question_router - req.session.data.farm.rain_water_area_added = true > checklist
router.get(/rain_water_question_router/, function (req, res) {
  let next = 'checklist'
  req.session.data.farm.rain_water_area_added = true
  res.redirect(next)
})

// livestock_question_router - req.session.data.farm.livestock_added = true > checklist
router.get(/livestock_question_router/, function (req, res) {
  let next = '../checklist'
  req.session.data.farm.livestock_added = true
  res.redirect(next)
})

// imports_exports_question_router - req.session.data.farm.imports_exports_added = true > checklist
router.get(/imports_exports_question_router/, function (req, res) {
  let next = '../checklist'
  req.session.data.farm.imports_exports_added = true
  res.redirect(next)
})

// manure_stores_question_router - req.session.data.farm.manure_stores_added = true > checklist
router.get(/manure_stores_question_router/, function (req, res) {
  let next = '../checklist'
  req.session.data.farm.manure_stores_added = true
  res.redirect(next)
})

module.exports = router