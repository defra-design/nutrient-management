var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');


// =============================================================================
// LIVESTOCK TEST
// Experimental routes for a unified livestock journey (cattle only).
// These are hardcoded for prototyping — not production ready.
// =============================================================================


// livestock_question.html → livestock_type (yes, hardcoded to cattle) or no_livestock (no)
router.get(/ltest_question_router/, function (req, res) {
  if (req.session.data.livestock_question == 'yes') {
    req.session.data.livestock_group = 'cattle'
    res.redirect('/planning/livestock_test/livestock_type')
  } else {
    res.redirect('/planning/livestock_test/no_livestock')
  }
})

// livestock_type.html → annual_numbers (resolves chosen_livestock from selected reference)
router.get(/ltest_cattle_reference/, function (req, res) {
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  res.redirect('annual_numbers')
})

// check.html → manage_livestock (saves the livestock record)
router.get(/ltest_check_handler/, function (req, res) {
  req.session.data.chosen_livestock.numbers_for_requirement = 2
  req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  req.session.data.show_success_message = true
  res.redirect('/planning/livestock_test/manage_livestock')
})

// manage_livestock.html "Add a livestock type" → livestock_type (resets journey state)
router.get(/ltest_reset_add/, function (req, res) {
  req.session.data.show_success_message = false
  req.session.data.livestock_update_journey = false
  res.redirect('/planning/livestock_test/livestock_type')
})


module.exports = router
