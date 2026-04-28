var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// =============================================================================
// MANNER CALCULATOR
// Routes for the MANNER-NPK estimate journey — a separate tool that lets users
// quickly calculate nutrient values from a manure application without going
// through the full planning journey.
// Journey: setup → manure group → manure type → date → quantity → results
// =============================================================================

// manner/about_manner.html → existing (farm already set up) or name (no farm yet)
router.get(/manner_setup_handler/, callback_functions.showSuccessMessage, function (req, res) {
  let next = (req.session.data.farm.setup == true) ? 'existing' : 'name'
  res.redirect(next)
})

// manner/crop.html → crop_type_all, defaults to cereals
router.get(/manner_crop_router/, function (req, res) {
  let next ='crop_type_all'
  if (req.session.data.crop_group == 'grass') {
    req.session.data.chosen_crop = 'grass'
    next = 'manure_group'
  } else if (req.session.data.crop_group == 'potatoes') {
    req.session.data.chosen_crop = 'Potatoes'
    next = 'crop_type_potato'
  } else if (req.session.data.crop_group == null) {
    req.session.data.crop_group = 'cereals'
  }
    res.redirect(next)
})


// manner/name.html → nvz (saves the field name to temp_field for the manner estimate)
router.get(/set_mannerfield_name_handler/, function (req, res) {
    if (!req.session.data.temp_field_name) {
      req.session.data.temp_field_name = "Long Field"
    }
    res.redirect('nvz');
})

// manner/existing.html → name (new farm) or farm (use existing)
router.get(/use_existing_farm_handler/, callback_functions.showSuccessMessage, function (req, res) {
  let next = (req.session.data.use_existing_farm == 'no') ? 'name' : 'farm'
  res.redirect(next)
})

// manner/results.html (copy another estimate?) → manure_group (yes) or results (no, saves and shows results)
router.get(/manner_copy_router/, callback_functions.showSuccessMessage, function (req, res) {
    let next = 'manure_group'
    if (req.session.data.copy_manner != 'no') {
        let tempApplication = allFunctions.createTempApplication(req.session.data.manure_date_day, req.session.data.manure_date_month, 2026, req.session.data.manure_type, req.session.data.manure_rate, req.session.data.manner_applications.length)
        req.session.data.manner_applications.push(tempApplication)
        next = 'results'
    }
    res.redirect(next);
})

// manner/change.html → results (saves a change to an existing estimate)
router.get(/manner_change_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_CHANGED'
    res.redirect('results')
})

// update/manner/manure_type.html → manner/results (saves updated manure type)
router.get(/manuretype_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_CHANGED'
    req.session.data.manner_applications[0].manuretype = allFunctions.getByName(req.session.data.manure_types, req.session.data.manure_type)
    res.redirect('/manner/results')
})

// update/manner/rate.html → manner/results (saves updated application rate)
router.get(/manner_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_CHANGED'
    req.session.data.manner_applications[0].rate = req.session.data.manure_rate
    res.redirect('manner/results')
})

// manner/manure_type.html → manure_date
router.get(/manuretype_manner_handler/, function (req, res) {
  if (!req.session.data.manure_type || req.session.data.manure_type === '') {
    req.session.data.manure_type = 'Cattle slurry'
  }
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
  res.redirect('manure_date')
})

// manner/manure_date.html → manure_applied (liquid) or manure_defaults (solid)
router.get(/manner_date_handler/, function (req, res) {
  if (req.session.data.manure_date_day < 1) req.session.data.manure_date_day = 21
  if (req.session.data.manure_date_month < 1) req.session.data.manure_date_month = 2
  if (req.session.data.manure_date_year < 1) req.session.data.manure_date_year = 2026
  const next = req.session.data.manure_type.liquid == true ? 'manure_applied' : 'manure_defaults'
  res.redirect(next)
})

// manner/manure_applied.html → manure_defaults (stores skip flag for injection methods)
router.get(/manner_applied_handler/, function (req, res) {
  const method = req.session.data.application_method
  req.session.data.skipIncorporation = (method === 'Shallow injection' || method === 'Deep injection')
  res.redirect('manure_defaults')
})

// manner/manure_value.html → rain_defaults (injection) or manure_incorporation_method
router.get(/manner_rate_handler/, function (req, res) {
  const next = req.session.data.skipIncorporation ? 'rain_defaults' : 'manure_incorporation_method'
  res.redirect(next)
})

// manner/quantity.html → results (creates the estimate and shows results)
router.get(/manner_results_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_DONE'
    let tempApplication = allFunctions.createTempApplication(req.session.data.manure_date_day, req.session.data.manure_date_month, 2026, req.session.data.manure_type, req.session.data.manure_rate, req.session.data.manner_applications.length)
    req.session.data.manner_applications.push(tempApplication)
    req.session.data.manure_type = null
    req.session.data.manure_group_id = null
    req.session.data.skipIncorporation = false
    res.redirect('results')
})

// manner/values.html → results#value (recalculates with updated values)
router.get(/manner_values_router/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_VALUE_UPDATED'
    res.redirect('results#value')
})

// manner/previous_calculations.html → estimates_list (copy) or existing (don't copy)
router.get(/copy_estimate_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let next = req.session.data.copy_estimate == 'yes' ? 'estimates_list' : 'existing';
    res.redirect(next)
})

// manner/estimates_list.html → results (shows MANNER_DONE success message after copying an estimate)
router.get(/manner_copy_estimate_selected_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'MANNER_DONE'
    res.redirect('/manner/results')
})

// manner/remove_application.html → results (removes selected application and shows success message)
router.get(/manner_remove_application_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let reference = parseInt(req.session.data.remove_application_reference)
    req.session.data.manner_applications = req.session.data.manner_applications.filter(a => a.reference !== reference)
    req.session.data.successMessage = 'MANNER_APPLICATION_REMOVED'
    res.redirect('/manner/results')
})

// update/manner/update.html → update/manner/manure_group (starts the manner update journey)
router.get(/update_manner_manure_handler/, callback_functions.showSuccessMessage, function (req, res) {
    res.redirect('/update/manner/manure_group')
})


module.exports = router
