var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

// const { checkout } = require('./routes_message_reset_handlers.js');

// Routes


router.get(/report_type_handler/, function (req, res) {
    let next = 'years'
  if (req.session.data.export_type == '7') {
      next = 'output_router'
  }
  res.redirect(next);
})


router.get(/derogation_add_router/, function (req, res) {
  if (req.session.data.derogation == 'no') {
      req.session.data.oaktree_farm.derogation = false
  } else {
      req.session.data.oaktree_farm.derogation = true
  }
  res.redirect('livestock_group');
})

router.get(/derogation_router/, function (req, res) {
  if (req.session.data.derogation == 'no') {
      req.session.data.oaktree_farm.derogation = false
  } else {
      req.session.data.oaktree_farm.derogation = true
  }
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
      next = './inventory/checklist'
  }
  res.redirect(next)
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
  let next = 'sizes'
  if (req.session.data.storage_type == 'poultry manure') {
      next = 'bulk_density'
  }
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
  let next = '/farm/storage/manage_storage'
  res.redirect(next)
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
  //function get livestock
  for (var reference in req.session.data.livestock_type_data ) {
      if (req.session.data.livestock_type_data[reference].reference == req.session.data.livestock_reference) {
          // console.log('found ' + req.session.data.livestock_type_data[reference])
          req.session.data.chosen_livestock = req.session.data.livestock_type_data[reference]
      }
  }
  // res.redirect("how_to_enter")
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
      req.session.data.livestock_entry = 'annually'
      next = 'livestock_numbers_average'
  }
  res.redirect(next)
})

router.get(/advanced_livestock_reference/, function (req, res) {
  // console.log('get livestock reference ' + req.session.data.livestock_reference)
  for (var reference in req.session.data.livestock_type_data ) {
      if (req.session.data.livestock_type_data[reference].reference == req.session.data.livestock_reference) {
          // console.log('found ' + req.session.data.livestock_type_data[reference])
          req.session.data.chosen_livestock = req.session.data.livestock_type_data[reference]
      }
  }
  // res.redirect("how_to_enter")
  if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
      req.session.data.livestock_entry = 'annually'
      next = 'livestock_numbers_average'
  }
  res.redirect('annual_numbers')
  // res.redirect('livestock_numbers')
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

// is there any livestock question (livestock none)
router.get(/livestock_inventory_router/, callback_functions.hide_error, function (req, res) {
    let next
    if (req.session.data.livestock_inventory == 'no') { 
        req.session.data.oaktree_farm.livestock_inventory = 4
        req.session.data.oaktree_farm.manure_system = 4
        next = '/outputs/inventory/checklist'
    } else {
        next = '/add_livestock_inventory/livestock_group'
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

// is there any livestock checklist link
router.get(/livestock_inventory_handler/, callback_functions.hideSuccessMessage, callback_functions.hide_error, function (req, res) {
    let next = '/add_livestock_inventory/livestock_none'
    if (req.session.data.oaktree_farm.livestock_inventory == 2 || req.session.data.oaktree_farm.livestock_inventory == 3) { 
        next = '/outputs/inventory/manage_livestock/index'
    } else {
        if (req.session.data.oaktree_farm.livestock_loading == 3) {
            next = '/outputs/inventory/manage_livestock/copy'
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

router.get(/livestock_copy_for_inventory_handler/, function (req, res) {
  let next = '/outputs/inventory/manage_livestock/index'
  if (req.session.data.copy_loading == 'yes') {
      for (let x in req.session.data.livestock_record_plan_year) {
          if (req.session.data.livestock_record_plan_year[x].numbers_for_nloading == 2) {
              req.session.data.livestock_record_plan_year[x].numbers_for_inventory = 1
          }
      }
      req.session.data.oaktree_farm.livestock_inventory = 2
  } else {
    next = '/add_livestock_inventory/livestock_none'
  }
  res.redirect(next);
})

// is there any livestock checklist link
router.get(/system_inventory_handler/, callback_functions.hide_error, callback_functions.hideSuccessMessage, function (req, res) {
    let next = '/outputs/inventory/manage_collection/index'
    if (req.session.data.oaktree_farm.livestock_inventory == null) { 
        next = 'livestock_inventory_handler'
    } else if (req.session.data.oaktree_farm.livestock_inventory == 4) {
        next = '/add_livestock_inventory/livestock_none'
    }
    res.redirect(next);
})

router.get(/water_inventory_handler/, callback_functions.hide_error, callback_functions.hideSuccessMessage, function (req, res) {
    let next = 'water_none'
    if (req.session.data.oaktree_farm.livestock_inventory == null) { 
        next = 'livestock_inventory_handler'
    } else if (req.session.data.oaktree_farm.livestock_inventory == 4) {
        next = '/add_livestock_inventory/livestock_none'
    } else if (req.session.data.oaktree_farm.wash_water == true) {
        next = '/outputs/inventory/manage_water/index'
    }    
    res.redirect(next);
})

//inventory and storage routes 

router.get(/rainwater_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.rainwater_area_added = true
    res.redirect('checklist')
})

router.get(/storage_figures_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.storage_figures = true
    res.redirect('checklist')
})

router.get(/low_risk_land_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    let next = 'area'
    req.session.data.oaktree_farm.low_risk_land_added = 2
    if (req.session.data.low_risk_land == 'no') {
        next = '/outputs/inventory/checklist'
        req.session.data.oaktree_farm.low_risk_land_added = 4
    }
    res.redirect(next)
})

router.get(/livestock_number_handler/, function (req, res) {
    // let next = (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') ? 'values_two' : 'check'
    let next = './system/manure_system'
    // if ( (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') && (req.session.data.livestock_entry == 'monthly') ) {
    //     next = 'values_two'
    // }
    if (req.session.data.export_type == '4' ) {
        next = 'manure_system_skip'
    }
    res.redirect(next)
})

router.get(/landcheck_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.low_risk_land_added = 2;
    res.redirect('/outputs/inventory/checklist')
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

router.get(/inventory_submit_router/, function (req, res) {
    let next = 'report'
    if ((req.session.data.oaktree_farm.imports_exports == null)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_loading == false) {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
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

// imports and exports
router.get(/export_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 2;
    let next = '/farm/exports/manage_exports'
    res.redirect(next)
})

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

router.get(/exportcheck_handler/, function (req, res) { 
  req.session.data.show_success_message = true;
  req.session.data.oaktree_farm.imports_exports = 2;
  if (req.session.data.imports_exports == 'export') {
      req.session.data.oaktree_farm.manure_exports = true;
  } else {
      req.session.data.oaktree_farm.manure_imports = true;
  }
  //reset defaults
  req.session.data.manure_type.name = null
  req.session.data.manure_group_id = null
  req.session.data.exported_day = null
  req.session.data.exported_month = null
  req.session.data.exported_year = null
  req.session.data.export_total = null
  res.redirect('/farm/exports/manage_exports')
})

router.get(/export_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
  if (req.session.data.oaktree_farm.manure_exports == true || req.session.data.oaktree_farm.manure_imports == true ) {
      res.redirect('manage_exports')
  } else {
      res.redirect('../../add_export/export_type')
  }
})

router.get(/get_manure_type_handler/, function (req, res) {
  //get object
  console.log('manure type ' + req.session.data.manure_type)
  for (var x in req.session.data.manure_types ) {
      if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
          req.session.data.manure_type = req.session.data.manure_types[x]
      }
  }
  console.log('manure type name' + req.session.data.manure_type.name)
  res.redirect('date')
})

router.get(/export_type_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
  let next = '/add_export/manure_group'
  if (req.query.export_type == 'export') {
      req.session.data.imports_exports = 'export'
  } else {
      req.session.data.imports_exports = 'import'
  }
  if (req.session.data.export_type == 4 ) {
      req.session.data.oaktree_farm.manure_group_id = 'livestock'
      next = '/add_export/manure_type'
  }
  res.redirect(next)
})

router.get(/change_export_handler/, callback_functions.hide_error, function (req, res) {
  if (req.query.export_type == 'export') {
      req.session.data.imports_exports = 'export'
  } else {
      req.session.data.imports_exports = 'import'
  }
  res.redirect('/update/exports/update')
})

router.get(/manure_export_type_handler/, callback_functions.setManureGroup, callback_functions.hide_error, function (req, res) {
  req.session.data.manure_group_id = 'livestock'
  res.redirect('manure_type')
})

router.get(/n_loading_export_handler/, callback_functions.setManureGroup, callback_functions.hide_error, function (req, res) {
  req.session.data.manure_group_id = 'livestock'
  res.redirect('/add_export/manure_type')
})

router.get(/inventory_export_handler/, callback_functions.hide_error, function (req, res) {
  res.redirect('/add_export/manure_group')
})

router.get(/export_type_router/, callback_functions.hide_error, function (req, res) {
  let next = 'export_type'
  if (req.session.data.imports_exports == 'no') {
      req.session.data.oaktree_farm.imports_exports = 4
      if (req.session.data.export_type == '8') {
          next = '/outputs/inventory/checklist'
      } else {
          next = '/outputs/n_loading/checklist'
      }
  }
  res.redirect(next)
})

router.get(/add_inventorynumbers_handler/, callback_functions.hide_error, function (req, res) {
    console.log(req.query.reference)
    for (var reference in req.session.data.livestock_record_plan_year) {
        if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
            console.log('found ' + req.session.data.livestock_record_plan_year[reference] + ' ' + req.session.data.livestock_record_plan_year[reference].type)
            req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
            req.session.data.livestock_group = req.session.data.livestock_record_plan_year[reference].type
        }
    }
	req.session.data.livestock_update_journey = true
    res.redirect('/add_livestock_inventory/annual_numbers');
})

router.get(/add_loadingnumbers_handler/, callback_functions.hide_error, function (req, res) {
  for (var reference in req.session.data.livestock_record_plan_year) {
      if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
          console.log('found ' + req.session.data.livestock_record_plan_year[reference])
          req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
          req.session.data.livestock_group = req.session.data.livestock_record_plan_year[reference].type
      }
  }
  req.session.data.livestock_update_journey = true
  let next
  if (req.session.data.chosen_livestock.type != 'pig' && req.session.data.chosen_livestock.type != 'poultry') {
      next = '/add_livestock/livestock_number_question'
  } else {
      next = '/add_livestock/livestock_numbers_average'
  }
  res.redirect(next)
})

router.get(/update_inventorynumbers_handler/, callback_functions.hide_error, function (req, res) {
for (var reference in req.session.data.livestock_record_plan_year) {
  if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
      console.log('found ' + req.session.data.livestock_record_plan_year[reference])
      req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
  }
}
req.session.data.livestock_update_journey = true
res.redirect('/add_livestock_inventory/check');
})

router.get(/update_loadingnumbers_handler/, callback_functions.hide_error, function (req, res) {
for (var reference in req.session.data.livestock_record_plan_year) {
  if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
      console.log('found ' + req.session.data.livestock_record_plan_year[reference])
      req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
  }
}
req.session.data.livestock_update_journey = true
res.redirect('/add_livestock/check');
})

router.get(/check_inventory_lstock_handler/, function (req, res) { 
  if (req.session.data.livestock_number != null && req.session.data.livestock_number != '') {
    req.session.data.chosen_livestock.total = req.session.data.livestock_number
  }
  if (req.session.data.livestock_update_journey == true) {
    for (let livestock_type in req.session.data.livestock_record_plan_year) {
        if (req.session.data.livestock_record_plan_year[livestock_type].reference == req.session.data.chosen_livestock.reference) {
            req.session.data.livestock_record_plan_year[livestock_type].numbers_for_inventory = 2
        }
    }
  } else {
      //function get livestock
      req.session.data.chosen_livestock.numbers_for_inventory = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  }
  req.session.data.show_success_message = true;
  req.session.data.oaktree_farm.livestock_inventory = 3;
  req.session.data.mostly_manure = null
  // req.session.data.oaktree_farm.manure_system = 'not_answered';
  // req.session.data.nitrogen_standard = null
  // req.session.data.livestock_occupancy = null
  res.redirect('/outputs/inventory/manage_livestock/index')
})

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
      //function get livestock
      req.session.data.chosen_livestock.numbers_for_nloading = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  }
  req.session.data.show_success_message = true;
  req.session.data.oaktree_farm.livestock_loading = 3;
  // req.session.data.nitrogen_standard = null
  // req.session.data.livestock_occupancy = null
  res.redirect('/outputs/n_loading/manage_livestock/index')
})

router.get(/add_manure_system_handler/, callback_functions.hide_error, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.manure_system_details = true
    req.session.data.oaktree_farm.manure_system = 2
    res.redirect('check');
})

router.get(/numbers_handler/, callback_functions.hide_error, function (req, res) {
      for (var reference in req.session.data.livestock_type_data ) {
      if (req.session.data.livestock_type_data[reference].reference == req.query.reference) {
          console.log('found ' + req.session.data.livestock_type_data[reference])
          req.session.data.chosen_livestock = req.session.data.livestock_type_data[reference]
      }
  }
  res.redirect('/outputs/inventory/manage_water/numbers');
})

router.get(/add_wash_water_details_handler/, callback_functions.hide_error, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.oaktree_farm.wash_water_details = true
  req.session.data.oaktree_farm.wash_water = 'done'
  res.redirect('numbers');
})

router.get(/livestock_poultry_router/, function (req, res) {
  let next = (req.session.data.livestock_group == 'poultry' || req.session.data.livestock_group == 'pig') ? 'occupancy_and_standard' : 'check'
  res.redirect(next);
})

router.get(/occupancy_handler/, function (req, res) {
  let next = 'check'
  if (req.session.data.occupancy_value == 'occupancy') {
      next = 'occupancy'
  } else if (req.session.data.occupancy_value == 'standard') {
      next = 'n_standard'
  }
  res.redirect(next);
})

router.get(/storage_name_handler/, function (req, res) {
  let temp_name = (req.session.data.material_type == "solid manure") ? "Shed" : "Tank"
  req.session.data.storage_name = (req.session.data.storage_name == '') ? temp_name : req.session.data.storage_name
  res.redirect('storage_type');
})

router.get(/storage_totals_handler/, function (req, res) {
  let next = 'storage_none'
  if (req.session.data.oaktree_farm.storage_added == true) {
      next = '/farm/storage/manage_storage'
  }
  res.redirect(next);
})

router.get(/inventory_storage_handler/, function (req, res) {
  let next = '/add_storage/material_type'
//   if (req.session.data.Y.length() != 0) {
//       next = '..farm/storage/manage_storage'
//   }
  res.redirect(next);
})

router.get(/lowrisk_land_handler/, function (req, res) {
  let next = '/add_land/land_options'
  if (req.session.data.oaktree_farm.low_risk_land_added == 2) {
      next = '/add_land/check'
  } else if (req.session.data.oaktree_farm.low_risk_land_added == 4) {
      next = '/add_land/land_options'
  }
  res.redirect(next);
})

router.get(/inventory_importexport_handler/, function (req, res) {
  let next = 'export_none'
  if (req.session.data.oaktree_farm.imports_exports == 2) {
      next = 'reset_manage_exports_message_handler'
  }
  res.redirect(next);
})

router.get(/manure_slurry_handler/, function (req, res) {
  let next = (req.session.data.mostly_manure == 'slurry') ? 'slurry' : 'solid'
  res.redirect(next)
})

// router.get(/export_inventory_router/, callback_functions.hide_error, function (req, res) {
//     req.session.data.oaktree_farm.manure_system_details = true
//     req.session.data.oaktree_farm.manure_system = 'done'
//     res.redirect('checklist');
// })

router.get(/monthly_volume_handler/, function (req, res) {
  let next = (req.session.data.monthly_volume == 'yes') ? 'monthly_volume' : 'livestock_type'
  res.redirect(next)
})

router.get(/add_wash_area_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.oaktree_farm.wash_water = true
  req.session.data.monthly_volume = null
  res.redirect('/outputs/inventory/manage_water/index')
})

router.get(/livestock_type_handler/, function (req, res) {
  let next = 'size'
  if (req.session.data.inventory_livestock == 'cattle') {
      next = 'water_hose'
  }
  res.redirect(next)
})

router.get(/wash_area_name_handler/, function (req, res) {
  if (req.session.data.wash_area_name == '' || req.session.data.wash_area_name == null) {
      req.session.data.wash_area_name = 'Washed area 1'
  }
  res.redirect('store')
})

router.get(/annual_housing_handler/, function (req, res) {
  req.session.data.chosen_month = req.query.month
  res.redirect('annual_housing_single')
})

router.get(/inventory_livestock_handler/, function (req, res) {
  let next = 'monthly_volume'
  if (req.session.data.inventory_livestock == 'cattle') {
      next = 'volume_question'
  } else {
      req.session.data.monthly_volume = 'yes'
  }
  res.redirect(next)
})

module.exports = router