var express = require('express')
var router = express.Router()

var callback_functions = require('./callbacks.js');



// =============================================================================
// MANURE INVENTORY
// Routes for the manure inventory report journey. This covers adding livestock,
// recording manure collection systems, rainwater areas, wash water areas,
// low run-off risk land, and imports/exports.
// =============================================================================



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
  let next = 'planning/add_export/manure_group'
  if (req.query.export_type == 'export') {
      req.session.data.imports_exports = 'export'
  } else {
      req.session.data.imports_exports = 'import'
  }
  if (req.session.data.export_type == 4 ) {
      req.session.data.farm.manure_group_id = 'livestock'
      next = 'planning/add_export/manure_type'
  }
  res.redirect(next)
})

router.get(/add_inventorynumbers_handler/, callback_functions.hide_error, function (req, res) {
    for (var reference in req.session.data.livestock_record_plan_year) {
        if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
            console.log('found ' + req.session.data.livestock_record_plan_year[reference] + ' ' + req.session.data.livestock_record_plan_year[reference].type)
            req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
            req.session.data.livestock_group = req.session.data.livestock_record_plan_year[reference].type
        }
    }
    req.session.data.livestock_update_journey = true
    let next = '/reports/storage_requirement_mvp/add_livestock/annual_numbers'
    if (req.session.data.chosen_livestock.numbers_for_requirement >= 2) {
        next = '/reports/storage_requirement_mvp/add_livestock/check'
    } else if (req.session.data.chosen_livestock.numbers_for_requirement == 1) {
        next = '/reports/storage_requirement_mvp/add_livestock/annual_numbers'
    }
    res.redirect(next)
})

// reports/manure_inventory/manage_livestock/index → loads record for editing and goes to check
router.get(/update_inventorynumbers_handler/, callback_functions.hide_error, function (req, res) {
for (var reference in req.session.data.livestock_record_plan_year) {
  if (req.session.data.livestock_record_plan_year[reference].reference == req.query.reference) {
      console.log('found ' + req.session.data.livestock_record_plan_year[reference])
      req.session.data.chosen_livestock = req.session.data.livestock_record_plan_year[reference]
  }
}
req.session.data.livestock_update_journey = true
res.redirect('/reports/storage_requirement_mvp/add_livestock/check');
})

// add_livestock/check.html → inventory/manage_livestock (saves livestock numbers for inventory)
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
      req.session.data.chosen_livestock.numbers_for_inventory = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  }
  req.session.data.show_success_message = true;
  req.session.data.mostly_manure = null
  res.redirect('/reports/storage_requirement_mvp/manage_livestock/index')
})

// add_livestock/check.html (storage requirement) → inventory/manage_livestock (saves numbers for requirement)
router.get(/check_requirement_lstock_handler/, function (req, res) {
  if (req.session.data.livestock_number != null && req.session.data.livestock_number != '') {
    req.session.data.chosen_livestock.total = req.session.data.livestock_number
  }
  if (req.session.data.livestock_update_journey == true) {
    for (let livestock_type in req.session.data.livestock_record_plan_year) {
        if (req.session.data.livestock_record_plan_year[livestock_type].reference == req.session.data.chosen_livestock.reference) {
            req.session.data.livestock_record_plan_year[livestock_type].numbers_for_requirement = 2
        }
    }
  } else {
      req.session.data.chosen_livestock.numbers_for_requirement = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.chosen_livestock)
  }
  req.session.data.show_success_message = true;
  req.session.data.mostly_manure = null
  req.session.data.farm.livestock_msreq_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
  res.redirect('/reports/storage_requirement_mvp/manage_livestock/index')
})

// add_livestock/values.html (pig/poultry) → occupancy_and_standard or check
router.get(/livestock_poultry_router/, function (req, res) {
  let next = (req.session.data.livestock_group == 'poultry' || req.session.data.livestock_group == 'pig') ? 'occupancy_and_standard' : 'check'
  res.redirect(next);
})

// add_livestock/occupancy_and_standard.html → occupancy, n_standard, or check
router.get(/occupancy_handler/, function (req, res) {
  let next = 'check'
  if (req.session.data.occupancy_value == 'occupancy') {
      next = 'occupancy'
  } else if (req.session.data.occupancy_value == 'standard') {
      next = 'n_standard'
  }
  res.redirect(next);
})

// add_livestock/livestock_number_question.html → ./system/manure_system or manure_system_skip (n-loading)
router.get(/livestock_number_handler/, function (req, res) {
    let next = './system/manure_system'
    if (req.session.data.export_type == '4' ) {
        next = 'manure_system_skip'
    }
    res.redirect(next)
})


// -------------------------
// MANURE COLLECTION SYSTEM
// -------------------------

// add_livestock/system/manure_system.html → check (saves the manure system details)
router.get(/add_manure_system_handler/, callback_functions.hide_error, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.farm.manure_system_details = true
    req.session.data.farm.manure_system = 2
    res.redirect('check');
})

// reports/storage_requirement_mvp/checklist.html (system row) → manage_collection
router.get(/system_inventory_handler/, callback_functions.hide_error, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('reports/manure_inventory/manage_collection/index');
})

// add_livestock/slurry_or_solid.html → slurry or solid
router.get(/manure_slurry_handler/, function (req, res) {
  let next = (req.session.data.mostly_manure == 'slurry') ? 'slurry' : 'solid'
  res.redirect(next)
})


// -------------------------
// MANURE STORAGE
// -------------------------

// management/farm/storage/storage_totals.html → manage_storage (existing) or storage_none (no storage)
router.get(/storage_totals_handler/, function (req, res) {
  let next = 'storage_none'
  if (req.session.data.farm.manure_stores_added == true) {
      next = '/management/farm/storage/manage_storage'
  }
  res.redirect(next);
})

// reports/manure_inventory (storage link) → add_export/material_type
router.get(/inventory_storage_handler/, function (req, res) {
  let next = 'planning/add_export/material_type'
  res.redirect(next);
})

// add_export/storage_name.html → storage_type (sets a default name if blank)
router.get(/storage_name_handler/, function (req, res) {
  let temp_name = (req.session.data.material_type == "solid manure") ? "Shed" : "Tank"
  req.session.data.storage_name = (req.session.data.storage_name == '') ? temp_name : req.session.data.storage_name
  res.redirect('storage_type');
})

// reports/manure_inventory/storage_values.html → checklist (saves storage figures)
router.get(/storage_figures_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.farm.storage_figures = true
    res.redirect('checklist')
})


// -------------------------
// RAINWATER AREAS
// -------------------------

// reports/storage_requirement_mvp/checklist.html (water row) → manage_water or water_none
router.get(/water_inventory_handler/, callback_functions.hide_error, callback_functions.hideSuccessMessage, function (req, res) {
    let next = 'water_none'
    if (req.session.data.farm.wash_water == true) {
        next = 'reports/manure_inventory/manage_water/index'
    }
    res.redirect(next);
})

// reports/manure_inventory/rainwater_area.html → checklist (saves that rainwater area has been added)
router.get(/rainwater_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.farm.rain_water_area_added = true
    res.redirect('checklist')
})


// -------------------------
// WASH WATER AREAS
// -------------------------

// add_wash_area/monthly_volume_question.html → monthly_volume (yes) or livestock_type (no)
router.get(/monthly_volume_handler/, function (req, res) {
  let next = (req.session.data.monthly_volume == 'yes') ? 'monthly_volume' : 'livestock_type'
  res.redirect(next)
})

// add_wash_area/check.html → manage_water (saves the wash water area)
router.get(/add_wash_area_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.farm.wash_water = true
  req.session.data.monthly_volume = null
  res.redirect('/reports/manure_inventory/manage_water/index')
})

// add_wash_area/livestock_type.html → water_hose (cattle) or size (other)
router.get(/livestock_type_handler/, function (req, res) {
  let next = 'size'
  if (req.session.data.inventory_livestock == 'cattle') {
      next = 'water_hose'
  }
  res.redirect(next)
})

// add_wash_area/wash_area_name.html → store (sets default name if blank)
router.get(/wash_area_name_handler/, function (req, res) {
  if (req.session.data.wash_area_name == '' || req.session.data.wash_area_name == null) {
      req.session.data.wash_area_name = 'Washed area 1'
  }
  res.redirect('store')
})

// add_wash_area/annual_housing.html → annual_housing_single (stores the chosen month from URL)
router.get(/annual_housing_handler/, function (req, res) {
  req.session.data.chosen_month = req.query.month
  res.redirect('annual_housing_single')
})

// add_wash_area/inventory_livestock.html → volume_question (cattle) or monthly_volume (other livestock)
router.get(/inventory_livestock_handler/, function (req, res) {
  let next = 'monthly_volume'
  if (req.session.data.inventory_livestock == 'cattle') {
      next = 'volume_question'
  } else {
      req.session.data.monthly_volume = 'yes'
  }
  res.redirect(next)
})

// manage_water/numbers.html → loads a livestock record for the wash water volume screen
router.get(/numbers_handler/, callback_functions.hide_error, function (req, res) {
  for (var reference in req.session.data.livestock_type_data ) {
    if (req.session.data.livestock_type_data[reference].reference == req.query.reference) {
        console.log('found ' + req.session.data.livestock_type_data[reference])
        req.session.data.chosen_livestock = req.session.data.livestock_type_data[reference]
    }
  }
  res.redirect('/reports/manure_inventory/manage_water/numbers');
})

// add_wash_area/check.html (wash water details) → numbers (saves that wash water details are complete)
router.get(/add_wash_water_details_handler/, callback_functions.hide_error, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.farm.wash_water_details = true
  req.session.data.farm.wash_water = 'done'
  res.redirect('numbers');
})


// -------------------------
// LOW RUN-OFF RISK LAND
// -------------------------

// reports/storage_requirement_mvp/checklist.html (land row) → add_land/check (existing) or add_land/land_options (new)
router.get(/lowrisk_land_handler/, function (req, res) {
  let next = './add_land/land_options'
  if (req.session.data.farm.low_risk_land_added == 2) {
      next = './add_land/check'
  } else if (req.session.data.farm.low_risk_land_added == 4) {
      next = './add_land/land_options'
  }
  res.redirect(next);
})

// add_land/low_risk_land.html → area (yes) or checklist with no land added (no)
router.get(/low_risk_land_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    let next = 'area'
    req.session.data.farm.low_risk_land_added = 2
    if (req.session.data.low_risk_land == 'no') {
        next = 'reports/storage_requirement_mvp/checklist'
        req.session.data.farm.low_risk_land_added = 4
    }
    res.redirect(next)
})

// add_land/check.html → checklist (saves low risk land)
router.get(/landcheck_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.farm.low_risk_land_added = 2;
    res.redirect('/reports/storage_requirement_mvp/checklist')
})


// -------------------------
// IMPORTS AND EXPORTS (INVENTORY)
// -------------------------

// reports/storage_requirement_mvp/checklist.html (imports/exports row) → manage_exports or export_none
router.get(/inventory_importexport_handler/, function (req, res) {
  let next = '/planning/add_export/export_none'
  if (req.session.data.farm.imports_exports_status != null && req.session.data.farm.imports_exports_status != 'NONE') {
      next = '/reset_manage_exports_message_handler'
  }
  res.redirect(next);
})


// -------------------------
// GENERATE REPORT
// -------------------------

// reports/storage_requirement_mvp/checklist.html (generate report) → report or checklist (if incomplete)
router.get(/inventory_submit_router/, function (req, res) {
    let next = 'report'
    if ((req.session.data.farm.imports_exports == null)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.farm.livestock_nloading_status == false) {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})


module.exports = router
