var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');
var SUCCESS = require('./success_messages.js');


// =============================================================================
// REPORTS
// Routes for all report types: field management, N-max, N-loading, manure
// inventory, planned nutrients, recommendations, field history, and storage.
// =============================================================================


// -------------------------
// REPORT TYPE SELECTION
// Routes that decide which report journey to start based on the chosen export type.
// Export type numbers: 1=fields, 3=N-max, 4=N-loading, 7=storage, 8=inventory,
// 9=planned nutrients, 10=recommendations, 11=field history, 12=storage requirement
// -------------------------

// reports/export.html → output_router (most types) or years (type 7 storage)
router.get(/report_type_handler/, function (req, res) {
  let next = req.session.data.export_type == '7' ? 'output_router' : 'years';
  res.redirect(next);
})

// reports/years.html → the correct starting point for each report type
router.get(/output_router/, callback_functions.hide_error, function (req, res) {
  var next = 'export_fields'

  // Field management report
  if (req.session.data.export_type == '1') {
      next = req.session.data.all_fields.length == 0 ? 'not_available_management' : 'export_fields'
  }
  // N-max report
  if (req.session.data.export_type == '3') {
      next = (req.session.data.all_fields.length == 0 || req.session.data.plan_crop_groups.length == 0) ? 'not_available_max' : 'export_crops'
      if (req.session.data.all_fields.length == 0 || req.session.data.plan_crop_groups.length == 0) {
          next = 'not_available_max'
      } else {
          next = 'export_crops'
      }
  }
  // N-loading report
  if (req.session.data.export_type == '4' ) {
      next = req.session.data.farm.derogation == null ? './n_loading/derogation' : './n_loading/checklist'
  }
  if (req.session.data.export_type == '5') {
      next = 'not_available_livestock'
  }
  if (req.session.data.export_type == '6') {
      next = 'not_available_imports'
  }
  // Existing manure storage report
  if (req.session.data.export_type == '7') {
    next = req.session.data.farm.storage_added != true ? 'not_available_storage' : '/management/farm/storage/manage_storage'
  }
  // Manure inventory and storage report
  if (req.session.data.export_type == '8') {
      next = '/reports/manure_inventory/checklist'
  }
  // Planned nutrients report
  if (req.session.data.export_type == '9') {
      next = '/reports/planned_nutrients'
  }
  // Recommendations report
  if (req.session.data.export_type == '10') {
      next = '/reports/recommendations'
  }
  // Confirmed field history report
  if (req.session.data.export_type == '11') {
      next = 'export_fields'
  }
  // Storage requirement report
  // manure_storage_requirement_mvp
  if (req.session.data.export_type == '12') {
      next = '/reports/manure_storage_requirement_mvp/checklist'
  }
  res.redirect(next)
})

// reports/export_fields.html → field_history report (type 11) or full_report (all other types)
router.get(/export_fields_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  let next = req.session.data.export_type == '11' ? '/reports/field_history/' : '/reports/full_report/';
  res.redirect(next);
})


// -------------------------
// N-LOADING REPORT
// -------------------------

// reports/n_loading/derogation.html (first visit, adding derogation) → livestock_group
router.get(/derogation_add_router/, function (req, res) {
  req.session.data.farm.derogation = req.session.data.derogation == 'no' ? false : true;
  res.redirect('livestock_group');
})

// reports/n_loading/derogation.html (returning visit) → checklist
router.get(/derogation_router/, function (req, res) {
  req.session.data.farm.derogation = req.session.data.derogation == 'no' ? false : true;
  res.redirect('checklist');
})

// reports/n_loading/checklist.html (generate report) → report or checklist (if incomplete)
router.get(/n_loading_submit_router/, function (req, res) {
  let next = 'report_no_derogation'
  if ((req.session.data.farm.area_added == false)) {
      next = 'checklist';
      req.session.data.show_error = true;
  }
  if ((req.session.data.farm.imports_exports == null)) {
      next = 'checklist';
      req.session.data.show_error = true;
  }
  if (req.session.data.farm.livestock_loading == 'not_answered') {
      next = 'checklist'
      req.session.data.show_error = true
  }
  res.redirect(next)
})

// reports/n_loading/area.html → checklist (saves that farm area has been added)
router.get(/farm_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.farm.area_added = true
  res.redirect('checklist')
})


// -------------------------
// MANURE STORAGE
// -------------------------

// management/farm/storage/storage_years.html → manage_storage (via reports, resets export type)
router.get(/manage_storage_router/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.export_type = null
  res.redirect('/management/farm/storage/storage_years');
})

// add_export/sizes.html → check, slope_question (earth banked lagoon), or weight (solid manure)
router.get(/storage_sizes_handler/, function (req, res) {
  let next = 'check'
  if (req.session.data.storage_type == 'earth banked lagoon') {
      next = 'slope_question'
  } else if (req.session.data.material_type == 'solid manure'){
      next = 'weight'
  }
  res.redirect(next)
})

// add_export/storage_type.html → bulk_density (poultry manure) or sizes
router.get(/storage_type_handler/, function (req, res) {
  let next = req.session.data.storage_type == 'poultry manure' ? 'bulk_density' : 'sizes';
  res.redirect(next)
})

// add_export/size.html → weight (solid), storage_type (dimensions), or check
router.get(/storage_size_handler/, function (req, res) {
  let next
  if (req.session.data.material_type == 'solid manure') {
    next = 'weight'
  } else {
    if (req.session.data.storage_question == 'dimensions') {
        next = 'storage_type'
    } else {
        next = 'check'
    }
  }
  res.redirect(next)
})

// add_export/check.html → manage_storage (saves the new storage entry)
router.get(/check_storage_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.farm.storage_added = true;
  let store_1 = allFunctions.createStorage(req.session.data.material_type, req.session.data.storage_name, req.session.data.storage_type)
  req.session.data.manure_storage.push(store_1)
  // req.session.data.successMessage = SUCCESS.EXPORTS.UPDATED;
  res.redirect('/management/farm/storage/manage_storage')
})

// management/farm/storage/storage_years.html → manage_storage (existing) or add_export/material_type (new)
router.get(/storage_year_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  if (req.session.data.farm.storage_added == true ) {
      res.redirect('manage_storage')
  } else {
      res.redirect('/reports/add_export/material_type')
  }
})


// -------------------------
// LIVESTOCK (N-LOADING)
// Routes for adding and managing livestock numbers used in the N-loading report.
// -------------------------

// reports/add_livestock/livestock_report_reset → manage_livestock (resets export type)
router.get(/livestock_report_reset/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.export_type = null
  res.redirect('livestock/manage_livestock')
})

// reports/n_loading/checklist.html (livestock row) → manage livestock or livestock_none or copy
router.get(/livestock_loading_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
  let next = '/reports/add_livestock/livestock_none'
  if (req.session.data.farm.livestock_loading == 2 || req.session.data.farm.livestock_loading == 3) {
      next = '/reports/n_loading/manage_livestock/index'
  } else {
      if (req.session.data.farm.livestock_inventory == 3) {
          next = '/reports/n_loading/manage_livestock/copy'
      }
  }
  res.redirect(next);
})

// reports/n_loading/checklist.html (no livestock question) → livestock_group or checklist (no livestock)
router.get(/livestock_loading_router/, callback_functions.hide_error, function (req, res) {
  let next = 'livestock_group'
  if (req.session.data.livestock_loading == 'no') {
      req.session.data.farm.livestock_inventory = 'none'
      req.session.data.farm.livestock_loading = 'none'
      next = '/reports/add_livestock/livestock_group'
  }
  res.redirect(next);
})

// reports/storage_requirement/checklist.html (livestock row) → manage livestock or livestock_none or copy
router.get(/livestock_requirement_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
  let next = './reports/add_livestock/livestock_none'
  if (req.session.data.farm.livestock_inventory == 2 || req.session.data.farm.livestock_inventory == 3) {
      next = '/reports/storage_requirement/manage_livestock/index'
  } else {
      if (req.session.data.farm.livestock_loading == 3) {
          next = '/reports/storage_requirement/manage_livestock/copy'
      }
  }
  res.redirect(next);
})

// reports/n_loading/manage_livestock/copy.html → manage livestock (copies inventory numbers to n-loading)
router.get(/livestock_copy_for_loading_handler/, function (req, res) {
  let next = '/reports/n_loading/manage_livestock/index'
  if (req.session.data.copy_inventory == 'yes') {
    for (let x in req.session.data.livestock_record_plan_year) {
      if (req.session.data.livestock_record_plan_year[x].numbers_for_inventory == 2) {
          req.session.data.livestock_record_plan_year[x].numbers_for_nloading = 1
      }
    }
    req.session.data.farm.livestock_loading = null
  } else {
    next = '/reports/add_livestock/livestock_none'
  }
  res.redirect(next);
})

// reports/add_livestock/livestock_years.html → manage_livestock (existing) or derogation (new)
router.get(/livestock_year_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  if (req.session.data.farm.livestock_loading == 'added') {
      res.redirect('manage_livestock')
  } else {
      res.redirect('/reports/add_livestock/derogation')
  }
})

// reports/add_livestock/how_to_enter.html → livestock_numbers (monthly) or livestock_numbers_average (annual)
router.get(/livestockentry_handler/, function (req, res) {
  let next = (req.session.data.livestock_entry == 'monthly') ? 'livestock_numbers' : 'livestock_numbers_average'
  res.redirect(next)
})

// reports/add_livestock/entry_method.html → values (average) or livestock_numbers (monthly)
router.get(/livestock_entry_handler/, function (req, res) {
  let next = (req.session.data.livestock_entry == 'average') ? 'values' : 'livestock_numbers'
  //blocked for now
  res.redirect('values')
})

// reports/add_livestock/values.html → check (fills in default values if blank)
router.get(/livestock_values_handler/, function (req, res) {
  if (req.session.data.livestock_number == null || req.session.data.livestock_number == '') {
    req.session.data.livestock_number = 10
  }
  if (req.session.data.nitrogen_standard == null  || req.session.data.nitrogen_standard == '') {
    req.session.data.nitrogen_standard = 83
  }
  res.redirect('check')
})

// reports/add_livestock/livestock_type.html → livestock_number_question or livestock_numbers_average (pig/poultry)
router.get(/get_livestock_reference/, function (req, res) {
  let next = 'livestock_number_question'
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
    req.session.data.livestock_entry = 'annually'
    next = 'livestock_numbers_average'
  }
  res.redirect(next)
})

// reports/add_livestock/advanced_type.html → annual_numbers (always, after resolving livestock type)
router.get(/advanced_livestock_reference/, function (req, res) {
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
    req.session.data.livestock_entry = 'annually'
    next = 'livestock_numbers_average'
  }
  res.redirect('annual_numbers')
})

// plan_view (add livestock link) → add_livestock/livestock_type (stores livestock reference from URL)
router.get(/add_livestock_handler/, function (req, res) {
  req.session.data.livestock_reference = req.query.livestock_reference
  res.redirect('/reports/add_livestock/livestock_type')
})

// reports/n_loading/manage_livestock/index → update journey for a specific livestock record
router.get(/add_loadingnumbers_handler/, callback_functions.hide_error, function (req, res) {
  req.session.data.livestock_update_journey = true
  let next
  for (var reference in req.session.data.livestock_record_plan_year) {
    if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
      console.log('found ' + req.session.data.livestock_record_plan_year[reference])
      req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
      req.session.data.livestock_group = req.session.data.livestock_record_plan_year[reference].type
    }
  }
  if (req.session.data.chosen_livestock.type != 'pig' && req.session.data.chosen_livestock.type != 'poultry') {
    next = '/reports/add_livestock/livestock_number_question'
  } else {
    next = '/reports/add_livestock/livestock_numbers_average'
  }
  res.redirect(next)
})

// reports/add_livestock/check.html → n_loading/manage_livestock (saves livestock numbers for n-loading)
router.get(/check_loading_lstock_handler/, function (req, res) {
  if (req.session.data.livestock_number != null && req.session.data.livestock_number != '') {
    req.session.data.chosen_livestock.total = req.session.data.livestock_number
  }
  if (req.session.data.livestock_update_journey == true) {
    for (let livestock_type in req.session.data.livestock_record_plan_year) {
      if (req.session.data.livestock_record_plan_year[livestock_type].reference == req.session.data.chosen_livestock.reference) {
        req.session.data.livestock_record_plan_year[livestock_type].numbers_for_nloading = 2
      }
    }
  } else {
      req.session.data.chosen_livestock.numbers_for_nloading = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  }
  req.session.data.show_success_message = true;
  req.session.data.farm.livestock_loading = 3;
  res.redirect('/reports/n_loading/manage_livestock/index')
})

// reports/add_livestock/update_numbers.html → back to check with the chosen record loaded
router.get(/update_loadingnumbers_handler/, callback_functions.hide_error, function (req, res) {
  for (var reference in req.session.data.livestock_record_plan_year) {
    if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
      console.log('found ' + req.session.data.livestock_record_plan_year[reference])
      req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
    }
  }
  req.session.data.livestock_update_journey = true
  res.redirect('/reports/add_livestock/check');
})

// reports/n_loading/manage_livestock (skip system) → check or system/manure_numbers
router.get(/manure_system_skip_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  let next = (req.session.data.manure_system_skip != 'yes') ? 'check' : './system/manure_numbers'
  res.redirect(next)
})


// -------------------------
// LIVESTOCK (INVENTORY)
// Routes for adding livestock numbers used in the manure inventory report.
// -------------------------

// reports/manure_inventory/checklist.html (livestock row) → manage livestock or livestock_none or copy
router.get(/livestock_inventory_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
  let next = '/reports/manure_inventory/reports/add_livestock/livestock_none'
  if (req.session.data.farm.livestock_inventory == 2 || req.session.data.farm.livestock_inventory == 3) {
    next = '/reports/manure_inventory/manage_livestock/index'
  } else {
    if (req.session.data.farm.livestock_loading == 3) {
        next = '/reports/manure_inventory/manage_livestock/copy'
    }
  }
  res.redirect(next);
})


// -------------------------
// IMPORTS AND EXPORTS
// Routes for recording manure exports and imports.
// -------------------------

// management/farm/exports/export_year.html → add_export/export_type (new) or manage_exports (existing)
router.get(/export_year_handler/, callback_functions.hideSuccessMessage, function (req, res) {
	let next = '/reports/add_export/export_type'
  if (req.session.data.farm.manure_exports == true || req.session.data.farm.manure_imports == true ) {
  	next = 'manage_exports'
  }
  res.redirect(next)
})


// update/exports/update.html (change export type) → update/exports/update
router.get(/change_export_handler/, callback_functions.hide_error, function (req, res) {
  if (req.query.export_type == 'export') {
      req.session.data.imports_exports = 'export'
  } else {
      req.session.data.imports_exports = 'import'
  }
  res.redirect('/update/exports/update')
})

// add_export/manure_group.html (export type selection) → manure_type (sets group to livestock)
router.get(/manure_export_type_handler/, callback_functions.setManureGroup, callback_functions.hide_error, function (req, res) {
  req.session.data.manure_group_id = 'livestock'
  res.redirect('manure_type')
})

// reports/n_loading (export link) → add_export/manure_type (sets group to livestock)
router.get(/n_loading_export_handler/, callback_functions.setManureGroup, callback_functions.hide_error, function (req, res) {
  req.session.data.manure_group_id = 'livestock'
  res.redirect('/reports/add_export/manure_type')
})

// reports/manure_inventory (export link) → add_export/manure_group
router.get(/inventory_export_handler/, callback_functions.hide_error, function (req, res) {
  res.redirect('/reports/add_export/manure_group')
})

// add_export/imports_exports.html → export_type (yes) or checklist (no imports/exports)
router.get(/export_type_router/, callback_functions.hide_error, function (req, res) {
  let next = 'export_type'
  if (req.session.data.imports_exports == 'no') {
      req.session.data.farm.imports_exports = 4
      if (req.session.data.export_type == '8') {
          next = '/reports/manure_inventory/checklist'
      } else {
          next = '/reports/n_loading/checklist'
      }
  }
  res.redirect(next)
})

// add_export/defaults.html → comments (fills in default values if blank)
router.get(/set_export_defaults_handler/, function (req, res) {
    console.log(
        req.session.data.manure_type.name + " " +
        req.session.data.exported_day + " " +
        req.session.data.export_total)

    if (req.session.data.manure_type.name == null) {
        req.session.data.manure_type.name = "Pig farmyard manure - Fresh"
    }
    if (req.session.data.exported_day == null) {
        req.session.data.exported_day = 16
        req.session.data.exported_month = 4
        req.session.data.exported_year = 2025
    }
    if (req.session.data.export_total == null) {
        req.session.data.export_total = 10
    }
    res.redirect('comments')
})

// add_export/check.html → manage_exports (saves the export/import record and resets temp vars)
router.get(/exportcheck_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.farm.imports_exports = 2;
  if (req.session.data.imports_exports == 'export') {
      req.session.data.farm.manure_exports = true;
  } else {
      req.session.data.farm.manure_imports = true;
  }
  //reset temp vars
  req.session.data.manure_type.name = null
  req.session.data.manure_group_id = null
  req.session.data.exported_day = null
  req.session.data.exported_month = null
  req.session.data.exported_year = null
  req.session.data.export_total = null
  res.redirect('/management/farm/exports/manage_exports')
})

// update/exports/update.html → manage_exports (saves changes to an existing export record)
router.get(/export_update_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = SUCCESS.EXPORTS.UPDATED;
  let next = '/management/farm/exports/manage_exports'
  res.redirect(next)
})

// add_export/manure_type.html → date (resolves full manure type object from the selected name)
router.get(/get_manure_type_report_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
  res.redirect('date')
})


module.exports = router