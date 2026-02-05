var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

// const { checkout } = require('./routes_message_reset_handlers.js');

// Routes

router.get(/report_type_handler/, function (req, res) {
  let next = req.session.data.export_type == '7' ? 'output_router' : 'years';
  res.redirect(next);
})

router.get(/derogation_add_router/, function (req, res) {
  req.session.data.oaktree_farm.derogation = req.session.data.derogation == 'no' ? false : true;
  res.redirect('livestock_group');
})

router.get(/derogation_router/, function (req, res) {
  req.session.data.oaktree_farm.derogation = req.session.data.derogation == 'no' ? false : true;
  res.redirect('checklist');
})

router.get(/output_router/, callback_functions.hide_error, function (req, res) {   
  var next = 'export_fields'
  if (req.session.data.export_type == '1') {
      if (req.session.data.all_fields.length == 0) {
          next = 'not_available_management'
      } else {
          next = 'export_fields'
      }
  }
  // NMAX
  if (req.session.data.export_type == '3') {
      if (req.session.data.all_fields.length == 0 || req.session.data.cropGroups.length == 0) {
          next = 'not_available_max'
      } else {
          next = 'export_crops'
      }
  }
  // N-LOADING
  if (req.session.data.export_type == '4' ) {
      if (req.session.data.oaktree_farm.derogation == null) {
          next = './n_loading/derogation'
      } else {
          next = './n_loading/checklist'
      }
  }
  if (req.session.data.export_type == '5') {
      next = 'not_available_livestock'
  }
  if (req.session.data.export_type == '6') {
      next = 'not_available_imports'
  }
  // EXISTING MANURE STORAGE
  if (req.session.data.export_type == '7') {
    if (req.session.data.oaktree_farm.storage_added != true) {
        next = 'not_available_storage'
    } else {
        next = '/farm/storage/manage_storage'
    }
  }
  // MANURE INVENTORY AND STORAGE
  if (req.session.data.export_type == '8') {
      next = '/manure_inventory/checklist'
  }
  // Planned nutrients report
  if (req.session.data.export_type == '9') {
      next = '/outputs/planned_nutrients'
  }
  // Planned nutrients report
  if (req.session.data.export_type == '10') {
      next = '/outputs/recommendations'
  }
  // Confirmed field history report
  if (req.session.data.export_type == '11') {
      next = 'export_fields'
  }
  // Confirmed field history report
  if (req.session.data.export_type == '12') {
      next = './storage_req/checklist'
  }

  res.redirect(next)
})

router.get(/export_fields_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  let next = req.session.data.export_type == '11' ? '/outputs/field_history/' : '/outputs/full_report/';
  res.redirect(next);
})

router.get(/manage_storage_router/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.export_type = null
  res.redirect('/farm/storage/storage_years');
})

router.get(/storage_sizes_handler/, function (req, res) {
  let next = 'check'
  if (req.session.data.storage_type == 'earth banked lagoon') {
      next = 'slope_question'
  } else if (req.session.data.material_type == 'solid manure'){
      next = 'weight'
  }
  res.redirect(next)
})

router.get(/storage_type_handler/, function (req, res) {
  let next = req.session.data.storage_type == 'poultry manure' ? 'bulk_density' : 'sizes';
  res.redirect(next)
})

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

router.get(/check_storage_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.oaktree_farm.storage_added = true;
  // function createStorage(store_type, store_name, store_material)
  let store_1 = allFunctions.createStorage(req.session.data.material_type, req.session.data.storage_name, req.session.data.storage_type)
  req.session.data.manure_storage.push(store_1)
  // req.session.data.successMessage = 2;
  res.redirect('/farm/storage/manage_storage')
})

// Livestock routes

router.get(/livestock_report_reset/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.export_type = null
  res.redirect('livestock/manage_livestock')
})

router.get(/manure_system_skip_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  let next = (req.session.data.manure_system_skip != 'yes') ? 'check' : './system/manure_numbers'
  res.redirect(next)
})

router.get(/farm_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.oaktree_farm.area_added = true
  res.redirect('checklist')
})

router.get(/livestockentry_handler/, function (req, res) {
  let next = (req.session.data.livestock_entry == 'monthly') ? 'livestock_numbers' : 'livestock_numbers_average'
  res.redirect(next)
})

router.get(/livestock_entry_handler/, function (req, res) {
  let next = (req.session.data.livestock_entry == 'average') ? 'values' : 'livestock_numbers'
  //blocked for now
  res.redirect('values')
})

router.get(/livestock_values_handler/, function (req, res) {
  if (req.session.data.livestock_number == null || req.session.data.livestock_number == '') {
      req.session.data.livestock_number = 10
  }
  if (req.session.data.nitrogen_standard == null  || req.session.data.nitrogen_standard == '') {
      req.session.data.nitrogen_standard = 83
  }
  res.redirect('check')
})

router.get(/get_livestock_reference/, function (req, res) {
  let next = 'livestock_number_question'
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
      req.session.data.livestock_entry = 'annually'
      next = 'livestock_numbers_average'
  }
  res.redirect(next)
})

router.get(/advanced_livestock_reference/, function (req, res) {
  req.session.data.chosen_livestock = allFunctions.getByReference(req.session.data.livestock_type_data, req.session.data.livestock_reference)
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
      req.session.data.livestock_entry = 'annually'
      next = 'livestock_numbers_average'
  }
  res.redirect('annual_numbers')
})

router.get(/add_livestock_handler/, function (req, res) {
  req.session.data.livestock_reference = req.query.livestock_reference
  res.redirect('/add_livestock/livestock_type')
})

router.get(/livestock_loading_router/, callback_functions.hide_error, function (req, res) {
    let next = 'livestock_group'
    if (req.session.data.livestock_loading == 'no') {
        req.session.data.oaktree_farm.livestock_inventory = 'none'
        req.session.data.oaktree_farm.livestock_loading = 'none'
        next = '/add_livestock/livestock_group'
    }
    res.redirect(next);
})

// is there any livestock checklist link
router.get(/livestock_loading_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
    let next = '/add_livestock/livestock_none'
    if (req.session.data.oaktree_farm.livestock_loading == 2 || req.session.data.oaktree_farm.livestock_loading == 3) { 
        next = '/outputs/n_loading/manage_livestock/index'
    } else {
        if (req.session.data.oaktree_farm.livestock_inventory == 3) {
            next = '/outputs/n_loading/manage_livestock/copy'
        }
    }
    res.redirect(next);
})

// is there any livestock checklist link INVENTORY
router.get(/livestock_inventory_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
    let next = '/manure_inventory/add_livestock/livestock_none'
    if (req.session.data.oaktree_farm.livestock_inventory == 2 || req.session.data.oaktree_farm.livestock_inventory == 3) { 
        next = '/manure_inventory/manage_livestock/index'
    } else {
        if (req.session.data.oaktree_farm.livestock_loading == 3) {
            next = '/manure_inventory/manage_livestock/copy'
        }
    }
    res.redirect(next);
})

// is there any livestock checklist link REQUIREMENT
router.get(/livestock_requirement_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
    let next = '/add_livestock_requirement/livestock_none'
    if (req.session.data.oaktree_farm.livestock_requirement == 2 || req.session.data.oaktree_farm.livestock_requirement == 3) { 
        next = '/outputs/storage_req/manage_livestock/index'
    } else {
        if (req.session.data.oaktree_farm.livestock_loading == 3) {
            next = '/outputs/storage_req/manage_livestock/copy'
        }
    }
    res.redirect(next);
})

router.get(/livestock_copy_for_loading_handler/, function (req, res) {
  let next = '/outputs/n_loading/manage_livestock/index'
  if (req.session.data.copy_inventory == 'yes') {
      for (let x in req.session.data.livestock_record_plan_year) {
          if (req.session.data.livestock_record_plan_year[x].numbers_for_inventory == 2) {
              req.session.data.livestock_record_plan_year[x].numbers_for_nloading = 1
          }
      }
      req.session.data.oaktree_farm.livestock_loading = null
  } else {
    next = '/add_livestock/livestock_none'
  }
  res.redirect(next);
})

router.get(/storage_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    if (req.session.data.oaktree_farm.storage_added == true ) {
        res.redirect('manage_storage')
    } else {
        res.redirect('../../add_storage/material_type')
    }
})

router.get(/livestock_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    if (req.session.data.oaktree_farm.livestock_loading == 'added') {
        res.redirect('manage_livestock')
    } else {
        res.redirect('/add_livestock/derogation')
    }
})

router.get(/n_loading_submit_router/, function (req, res) {
    let next = 'report_no_derogation'
    if ((req.session.data.oaktree_farm.area_added == false)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if ((req.session.data.oaktree_farm.imports_exports == null)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_loading == 'not_answered') {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})


module.exports = router