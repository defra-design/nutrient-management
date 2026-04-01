var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');
var SUCCESS = require('./success_messages.js');
var { LIVESTOCK_INVENTORY_IN_PROGRESS, LIVESTOCK_INVENTORY_COMPLETE, LIVESTOCK_INVENTORY_NO_LIVESTOCK } = require('./constants.js');

// =====================================
// Routes for manure storage requirement
// =====================================

// farm_area_question_router - req.session.data.farm.area_status = true > checklist
router.get(/farm_area_question_router/, function (req, res) {
  req.session.data.farm.area_added = true
  res.redirect('checklist')
})

// rain_water_question_router - req.session.data.farm.rain_water_area_status = true > checklist
router.get(/rain_water_question_router/, function (req, res) {
  req.session.data.farm.rain_water_area_added = true
  res.redirect('checklist')
})

// livestock_question_router - req.session.data.farm.livestock_status = true > checklist
router.get(/livestock_question_router/, function (req, res) {
  let next
  console.log(req.session.data.livestock_question)
  if (req.session.data.livestock_question == 'no') {
    req.session.data.farm.livestock_status = 'NONE'
    next = '../checklist'
  } else if (req.session.data.livestock_question == 'yes') {
    req.session.data.farm.livestock_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
    next = 'type'
  }
  res.redirect(next)
})

// imports_exports_question_router - req.session.data.farm.imports_exports_status = true > checklist
router.get(/imports_exports_question_router/, function (req, res) {
  let next
  if (req.session.data.imports_exports_question == 'no') {
    req.session.data.farm.imports_exports_status = 'NONE'
    next = '../checklist'
  } else if (req.session.data.imports_exports_question == 'yes') {
    req.session.data.farm.imports_exports_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
    next = 'type'
  }
  res.redirect(next)
})

// manure_stores_question_router - req.session.data.farm.manure_stores_status = true > checklist
router.get(/manure_stores_question_router/, function (req, res) {
  let next
  if (req.session.data.manure_stores_question == 'no') {
    req.session.data.farm.manure_stores_status = 'NONE'
    next = '../checklist'
  } else if (req.session.data.manure_stores_question == 'yes') {
    if (req.session.data.farm.manure_stores_status != 'NONE') {
      next = '/management/farm/storage/manage_storage'
    } else {
      req.session.data.farm.manure_stores_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
      next = '/reports/add_storage/storage_type'
    }
  }
  res.redirect(next)
})

module.exports = router