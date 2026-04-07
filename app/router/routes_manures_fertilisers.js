var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// =============================================================================
// MANAGE MANURES
// Routes for the add-manure journey (fields → group → type → date → defaults
// → quantity → incorporation → check your answers) and for updating existing applications.
// =============================================================================

// plan_view → update/manure/update (sets the update context from URL params)
router.get(/manure_update_router/, function (req, res) {
  req.session.data.update_type = req.query.update_type
  req.session.data.chosen_application = req.query.application_id
  req.session.data.chosen_field_id = req.query.field
  res.redirect('/update/manure/update')
})

// update/manure/check.html → plan_view#organic (saves manure update)
router.get(/manure_update_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 'CROP_PLAN_MANURE_UPDATED';
  res.redirect('/management/farm/crop_plan/plan_view#organic')
})

// add_manure/quantity.html → manure_area, manure_rate, or manure_incorporation_method
router.get(/manure_quantity_router/, function (req, res) {
  let next = 'manure_incorporation_method'
  if (req.session.data.quantity_type == "area") {
    next = 'manure_area'
  } else if (req.session.data.quantity_type == "rate") {
    next = 'manure_rate'
  }
  res.redirect(next);
})

// add_manure/manure_rate.html → manure_rate_warning (≥250 t/ha) or manure_incorporation_method
router.get(/manure_rate_handler/, function (req, res) {
  req.session.data.application_rate = parseInt(req.session.data.application_rate)
  let next = 'manure_incorporation_method'
  if (req.session.data.application_rate >= 250) {
    req.session.data.show_manure_notification = true
    next = 'manure_rate_warning'
  } else {
    req.session.data.show_manure_notification = false
  }
  res.redirect(next);
})

// update/manure/update.html (change rate) → manure_rate_warning (≥250 t/ha) or update
router.get(/change_rate_handler/, function (req, res) {
  let next = 'update'
  if (req.session.data.application_rate >= 250) {
    req.session.data.show_manure_notification = true
    next = 'manure_rate_warning'
  } else {
    req.session.data.show_manure_notification = false
  }
  res.redirect(next);
})

// manner/quantity.html → manure_value (area/rate) or results (straight to results)
router.get(/manner_quantity_handler/, function (req, res) {
  let next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'results';
  res.redirect(next);
})

// add_manure/manure_fields.html → manure_group (all/group) or manure_fields_two (specific fields)
router.get(/select_manure_fields_router/, function (req, res) {
  let next = 'manure_group'
  if (req.session.data.manure_field_option == 'specific') {
    next = 'manure_fields_two'
  } else {
    req.session.data.chosen_fields = allFunctions.collectFieldsFromGroups(req.session.data.planned_crop_groups, req.session.data.manure_field_option)
  }
  res.redirect(next)
})

// add_manure/manure_type.html → manure_date or manure_defoliation (grass setup)
router.get(/get_manure_type_planning_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
  let next = 'manure_date'
  if (req.session.data.farm.grass_setup == true) {
      next = 'manure_defoliation'
  }
  res.redirect(next)
})

// manner/manure_type.html → manure_date
router.get(/manuretype_manner_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
  res.redirect('manure_date')
})

// add_manure/manure_date.html → manure_defaults (solid) or manure_applied (liquid)
router.get(/set_manure_date_handler/, function (req, res) {
  let next = "manure_defaults"
  if (req.session.data.manure_date_day < 1) {
    req.session.data.manure_date_day = 21
  }
  if (req.session.data.manure_date_month < 1) {
    req.session.data.manure_date_month = 2
  }
  if (req.session.data.manure_date_year < 1) {
    req.session.data.manure_date_year = 2026
  }
  if (req.session.data.manure_type.liquid == true) {
    next = "manure_applied"
  }
    res.redirect(next)
})

// add_manure/check.html → plan_view#organic (creates a manure application record for each field)
router.get(/add_manure_handler/, callback_functions.showsuccess_message, function (req, res) {
    req.session.data.successMessage = 'CROP_PLAN_MANURE_ADDED'
    const group_id = req.session.data.manure_applications.length + 1
    const manure_id = req.session.data.manure_type.name
    const year = req.session.data.farm.planning_year
    const field_list = req.session.data.chosen_fields
    const application_date = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year
    field_list.forEach(field => {
      req.session.data.manure_applications.push(allFunctions.add_manure_application(group_id, year, field, application_date, manure_id))
    })
    req.session.data.manure_fields = null
    res.redirect('/management/farm/crop_plan/plan_view#organic')
})

// field_plan/index → add_manure/manure_fields (multi) or add_manure/manure_group (single field)
router.get(/plan_manure_application_router/, function (req, res) {
  let next
  req.session.data.manure_journey = req.query.manurejourney
  if (req.session.data.manure_journey == 'multi') {
    next = '/planning/add_manure/manure_fields'
  } else {
    req.session.data.manure_fields = []
    req.session.data.manure_fields.push(req.session.data.chosen_field.field_id)
    next = '/planning/add_manure/manure_group'
  }
  res.redirect(next)
})

// add_manure/manure_group.html → manure_type (sets the manure group via callback)
router.get(/manuregroup_handler/, callback_functions.setManureGroup, function (req, res) {
  res.redirect("manure_type")
})

// add_manure/manure_defaults.html → manure_defaults_update (edit) or manure_quantity (accept defaults)
router.get(/enter_manure_defualts_handler/, function (req, res) {
  let next = (req.session.data.edit_manure_defaults === "no") ? 'manure_defaults_update' : 'manure_quantity';
  res.redirect(next);
})

// add_manure/manure_date_notification trigger → manure_datenotification (shows the date warning)
router.get(/manuredate_handler/, function (req, res) {
  if (req.query.notification == 'true') {
    req.session.data.show_manure_notification = true
  }
  res.redirect('/planning/add_manure/manure_datenotification')
})

// add_manure/manure_type (livestock) → manure_date (resolves livestock type reference)
router.get(/livestock_type_v7_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_type_livestock_data, req.session.data.manure_type)
  res.redirect("manure_date")
})

// planning/add_export/type.html (livestock) → date (resolves livestock type reference for export)
router.get(/livestock_type_export_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_type_livestock_data, req.session.data.manure_type)
  res.redirect("date")
})

// add_manure/incorporation.html → rain_defaults (not incorporated) or manure_delay (incorporated)
router.get(/incorporation_handler/, function (req, res) {
  let next = (req.session.data.incorporation_method == "not_incorporated") ? 'rain_defaults' : 'manure_delay'
  res.redirect(next)
})

// add_manure/manure_date.html (manner variant) → manure_defaults (solid) or manure_applied (liquid)
router.get(/manure_date_handler/, function (req, res) {
  let next = 'manure_defaults'
  if (req.session.data.manure_date_day < 1) req.session.data.manure_date_day = 21;
  if (req.session.data.manure_date_month < 1) req.session.data.manure_date_month = 2;
  if (req.session.data.manure_date_year < 1) req.session.data.manure_date_year = 2024;
  if (req.session.data.manure_type.liquid == true) {
      next = "manure_applied"
  }
  res.redirect(next)
})


// =============================================================================
// MANAGE FERTILISERS
// Routes for the add-fertiliser journey (fields → when → amount → date → check your answers).
// =============================================================================

// update/fertiliser/check.html → plan_view (saves fertiliser update)
router.get(/fertiliser_update_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 'CROP_PLAN_FERTILISER_UPDATED';
  res.redirect('/management/farm/crop_plan/plan_view#inorganic')
})

// field_plan/index → add_fertiliser/fertiliser_fields (multi) or add_fertiliser/fertiliser_when (single)
router.get(/update_fertiliser_handler/, function (req, res) {
  req.session.data.fertiliser_journey = req.query.fertiliserjourney
  let next = (req.session.data.fertiliser_journey == 'multi' ? 'fertiliser_fields' : 'fertiliser_when')
  res.redirect('/planning/add_fertiliser/' + next)
})

// add_fertiliser/fertiliser_fields.html → fertiliser_when (all/group) or fertiliser_fields_two (specific)
router.get(/set_fertiliser_fields_handler/, function (req, res) {
  let next = 'fertiliser_when'
  if (req.session.data.fertiliser_fields_option == 'specific') {
    next = 'fertiliser_fields_two'
  } else {
    req.session.data.chosen_fields = allFunctions.collectFieldsFromGroups(req.session.data.planned_crop_groups, req.session.data.fertiliser_fields_option)
  }
  res.redirect(next)
})

// add_fertiliser/check.html → plan_view#inorganic (creates a fertiliser application record for each field)
router.get(/add_fertiliser_handler/, callback_functions.showsuccess_message, function (req, res) {
  let fertiliserDate = req.session.data.fertiliser_date_day + '/' + req.session.data.fertiliser_date_month + '/' + req.session.data.fertiliser_date_year
  let field_list = req.session.data.chosen_fields
  let next = '/management/farm/crop_plan/plan_view#inorganic'

  field_list.forEach(field => {
    req.session.data.fertiliser_applications.push(allFunctions.addFertiliserApplication(
        1, //temp group id
        req.session.data.farm.planning_year,
        field,
        fertiliserDate,
        req.session.data.nitrogen,
        req.session.data.phosphate,
        req.session.data.potash,
        req.session.data.sulphur,
        req.session.data.lime
    ))
  })
  req.session.data.chosen_fields = []
  req.session.data.successMessage = 'CROP_PLAN_FERTILISER_ADDED'
  res.redirect(next)
})

// add_fertiliser/date.html → fertiliser_amount (with date validation fallbacks)
router.get(/fertiliser_date_handler/, function (req, res) {
  if (req.session.data.fertiliser_date_day < 1) req.session.data.fertiliser_date_day = 21;
  if (req.session.data.fertiliser_date_month < 1) req.session.data.fertiliser_date_month = 2;
  if (req.session.data.fertiliser_date_year < 1) req.session.data.fertiliser_date_year = 2026;
  res.redirect("fertiliser_amount")
})

// plan_view (remove link) → plan_view (removes fertiliser application, shows success banner)
router.get(/fertiliser_remove_router/, callback_functions.showsuccess_message, function (req, res) {
  req.session.data.successMessage = 'CROP_PLAN_FERTILISER_REMOVED'
  res.redirect('/management/farm/crop_plan/plan_view')
})

// plan_view (change link) → update/fertiliser/update (loads the application to edit)
router.get(/fertiliser_change_router/, callback_functions.getApplicationByReference, function (req, res) {
  res.redirect('/update/fertiliser/update')
})


module.exports = router
