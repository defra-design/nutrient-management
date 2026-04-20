var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// =============================================================================
// LIVESTOCK TEST
// Experimental routes for a unified livestock journey (cattle only).
// These are hardcoded for prototyping — not production ready.
// =============================================================================


// livestock_question.html → type (yes) or no_livestock (no)
router.get(/ltest_question_router/, function (req, res) {
  if (req.session.data.livestock_question == 'yes') {
    req.session.data.ltestLivestock = []
    res.redirect('/planning/livestock_test/type')
  } else {
    res.redirect('/planning/livestock_test/no_livestock')
  }
})

// type.html → livestock_type (captures livestock_group from form)
router.get(/ltest_group_handler/, function (req, res) {
  res.redirect('/planning/livestock_test/livestock_type')
})

// livestock_type.html → annual_numbers (resolves chosen_livestock from selected reference)
router.get(/ltest_cattle_reference/, function (req, res) {
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  res.redirect('annual_numbers')
})

// check.html → manage_livestock (saves the livestock record into ltestLivestock)
router.get(/ltest_check_handler/, function (req, res) {
  req.session.data.ltestLivestock.push({
    name: req.session.data.chosen_livestock.name,
    type: req.session.data.chosen_livestock.type,
    reference: req.session.data.chosen_livestock.reference
  })
  req.session.data.successMessage = 'LIVESTOCK_ADDED'
  res.redirect('/planning/livestock_test/manage_livestock')
})

// update.html → manage_livestock (shows the right success message)
router.get(/ltest_update_handler/, function (req, res) {
  req.session.data.successMessage = 'LIVESTOCK_UPDATED'
  res.redirect('/planning/livestock_test/manage_livestock')
})

// manage_livestock.html "Add a livestock type" → type (resets journey state)
router.get(/ltest_reset_add/, function (req, res) {
  req.session.data.successMessage = ''
  req.session.data.livestock_update_journey = false
  res.redirect('/planning/livestock_test/type')
})

// annual_separator.html → separator_numbers (yes/slurry) or check (no/solid)
router.get('/planning/livestock_test/annual_separator_handler', function (req, res) {
  if (req.session.data.mostly_manure === 'slurry') {
    res.redirect('separator_numbers')
  } else {
    res.redirect('check')
  }
})

// annual_housing_question.html → annual_separator (yes) or annual_housing_list (no)
router.get('/planning/livestock_test/annual_housing_question_handler', function (req, res) {
  if (req.session.data.useDefaults === 'yes') {
    res.redirect('annual_separator')
  } else {
    res.redirect('annual_housing_list')
  }
})


router.get(/update_test_livestock/, callback_functions.hide_error, function (req, res) {
  for (var i in req.session.data.ltestLivestock) {
    if (req.session.data.ltestLivestock[i].reference == req.query.reference) {
      req.session.data.chosen_livestock = req.session.data.ltestLivestock[i]
      req.session.data.livestock_group = req.session.data.ltestLivestock[i].type
    }
  }
  req.session.data.livestock_update_journey = true
  res.redirect('/planning/livestock_test/update');
})
  
module.exports = router