var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// =============================================================================
// ENTRY POINTS
// Routes triggered from the start screen to decide where to send the user.
// =============================================================================

// start.html → disclaimer (first visit) or farms hub (returning user)
router.get(/start_router/, function (req, res) {
  let next = (req.session.data.show_info == false) ? '/options' : 'disclaimer'
  res.redirect(next)
})

// start.html (plan/estimate choice) → farm hub, MANNER about page, or previous calculations
router.get(/plan_estimate_router/, function (req, res) {
  let next
  if (req.session.data.farm.setup == true) {
    next = '/management/farm/farms'
  } else {
    next = '/about_nmpt'
  }
  if (req.session.data.plan_estimate == 'estimate' ) {
    if (req.session.data.manner_applications.length == 0) {
        next = '/manner/about_manner'
    } else {
        next = '/manner/previous_calculations'
    }
  }
  res.redirect(next)
})


// =============================================================================
// ADD / EDIT A FARM
// Routes for the add-farm journey (name → country → postcode → address →
// nvz → elevation → organic → check your answers) and for deleting the farm.
// =============================================================================

// add-farm/name.html → country
router.get(/set_farm_name_handler/, function (req, res) {
  if (req.session.data.farm_name != "") req.session.data.farm.name = req.session.data.farm_name
  res.redirect('country')
})

// add-farm/postcode.html → address
router.get(/set_postcode_handler/, function (req, res) {
  if (req.session.data.farm_postcode != "") req.session.data.farm.postcode = req.session.data.farm_postcode
  res.redirect('address')
})

// add-farm/nvz.html → elevation
router.get(/set_nvz_handler/, function (req, res) {
  if (req.session.data.farm_nvz != "") req.session.data.farm.nvz = req.session.data.farm_nvz
  res.redirect('elevation')
})

// add-farm/elevation.html → organic
router.get(/set_elevation_handler/, function (req, res) {
  if (req.session.data.farm_elevation != "") req.session.data.farm.elevation = req.session.data.farm_elevation
  res.redirect('organic')
})

// add-farm/check.html → farm hub (marks farm as set up)
router.get(/add_farm_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.successMessage = 'FARM_ADDED'
  req.session.data.farm.setup = true;
  res.redirect('/management/farm/hub');
})

// management/farm/remove.html → farms list (marks farm as removed)
router.get(/delete_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.successMessage = 'FARM_REMOVED'
  req.session.data.farm.setup = false;
  res.redirect('/management/farm/farms');
})


// =============================================================================
// ADD / EDIT A FIELD
// Routes for the add-field journey (name → area → nvz → elevation → soil →
// previous use → check) and for copying, updating, and selecting fields.
// =============================================================================

// add-field/name.html → area (saves the field name to temp_field)
router.get(/set_field_name_handler/, function (req, res) {
  req.session.data.temp_field = allFunctions.setFieldName(req.session.data.temp_field, req.session.data.temp_field_name, req.session.data.all_fields.length);
  res.redirect('./area')
})

// add-field/area.html → nvz (if farm has some NVZ land) or elevation or soil-one
router.get(/field_size_router/, function (req, res) {
  req.session.data.temp_field = allFunctions.setFieldSizes(req.session.data.temp_field, req.session.data.total_area, req.session.data.cropped_area, req.session.data.non_spreading_area);
  let next = req.session.data.farm.nvz === 'some' ? 'nvz' : (req.session.data.farm.elevation === 'some' ? 'elevation' : 'soil-one');
  res.redirect(next);
})

// add-field/nvz.html → elevation (if farm has some elevated land) or soil-one
router.get(/nvz_router/, function (req, res) {
  let next = (req.session.data.farm.elevation == 'some') ? 'elevation' : 'soil-one';
  res.redirect(next);
})

// add-field/soil-one (add_analysis.html) → soil-two (enter values) or previous_use (no analysis)
router.get(/add_soil_analysis_router/, function (req, res) {
  let next = (req.session.data.soil_analysis == "yes") ? 'soil-two' : 'previous_use'
  res.redirect(next)
})

// add-field/soil-two (values.html) → values_two or values_three depending on entry method
router.get(/soil_values_router/, function (req, res) {
  let next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
  res.redirect(next)
})

// add-field/previous_use.html → crop_group (arable) or grass_years (previously grass)
router.get(/grass_history_router/, function (req, res) {
  let next = 'crop_group'
  if (req.session.data.previously_grass == 'yes') {
    req.session.data.chosen_crop = 'Grass'
    next = 'grass_years'
  }
  res.redirect(next)
})

// add-field/grass_years.html → previous_lay or previous_cuts (if 2025 was selected)
router.get(/grass_years_handler/, function (req, res) {
  let next = req.session.data.grass_years.includes('2025') ? 'previous_cuts' : 'previous_lay'
  res.redirect(next)
})

// add-field/check.html → manage-fields (saves the field and resets temp vars)
router.get(/add_field_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 'FIELD_ADDED'
    req.session.data.farm.fields_added = true;
    req.session.data.all_fields.push(req.session.data.temp_field);
    //reset temp vars
    req.session.data.chosen_crop = req.session.data.total_area = req.session.data.cropped_area =
    req.session.data.non_spreading_area = req.session.data.soil_type = req.session.data.field_nvz = req.session.data.field_alt = null
    res.redirect('/management/farm/field/manage-fields');
})

// add-field/copy/name.html → analysis (copy journey variant of set_field_name_handler)
router.get(/copy_name_handler/, function (req, res) {
  req.session.data.temp_field = allFunctions.setFieldName(req.session.data.temp_field, req.session.data.temp_field_name, req.session.data.all_fields.length);
  res.redirect('./analysis')
})

// field/update.html → field-details (saves field detail changes)
router.get(/field_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.successMessage = 4 //field updated
  res.redirect('/management/farm/field/field-details')
})

// field/change_soil.html → field-details (saves soil type change)
router.get(/soil_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.successMessage = 5 //soil updated
  res.redirect('/management/farm/field/field-details')
})

// field/split_merge.html → copy/fields (copy) or name (new field)
router.get(/copy_field_router/, function (req, res) {
  req.session.data.show_success_message = false;
  let next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name';
  res.redirect(next)
})

// add-field/copy/crop_group.html → crop_type_all, previous-grass, or check depending on crop group
router.get(/previous_group_router/, function (req, res) {
  const group = req.session.data.crop_group || 'cereals'
  const groupMap = {
    grass: { crop: 'Grass', next: 'previous-grass' },
    herbs: { crop: 'Herbs', next: 'check' },
    other: { crop: 'Other', next: 'check' },
  }
  if (groupMap[group]) {
    req.session.data.chosen_crop = groupMap[group].crop
    req.session.data.crop_group = group
    res.redirect(groupMap[group].next)
  } else {
    res.redirect('crop_type_all')
  }
})

// add-field/previous_clover.html → check (yes) or previous_nitrogen (no)
router.get(/previous_clover_router/, function (req, res) {
  let next = (req.session.data.previous_clover == "yes") ? 'check' : 'previous_nitrogen'
  res.redirect(next)
})

// field type selection → copy/fields (copy) or name (new)
router.get(/fieldtype_router/, function (req, res) {
  let next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
  res.redirect(next)
})

// field/field-details → field-details (selects a field and stores it as chosen_field)
router.get(/field-select-handler/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field)
  const next = req.session.data.chosen_field.split_merged === 'ORIGINAL'
    ? '/management/farm/field/field-details_split_merged'
    : '/management/farm/field/field-details'
  res.redirect(next)
})


// =============================================================================
// SNS (SOIL NITROGEN SUPPLY)
// Routes for the SNS measurement journey within a field plan.
// =============================================================================

// add_sns/check.html → field_plan/index (saves SNS data to the chosen field)
router.get(/add_sns_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 'FIELD_PLAN_SNS_ADDED';
  req.session.data.chosen_field.sns = true;
  res.redirect('/management/farm/field_plan/index');
})

// add_sns/mineralisation.html → organic or adjustment
router.get(/mineralisation_router/, function (req, res) {
  let next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
  res.redirect(next)
})

// add_sns/croptype.html → sample_depth, values, or organic_adjustment depending on crop group
router.get(/field_type_router/, function (req, res) {
  let next = (req.session.data.field_type == "copy") ? './copy/fields' : 'name'
  res.redirect(next)
})

router.get(/log_croptype_router/, function (req, res) {
  let next
  if (req.session.data.sns_method == "no") {
    next = '../check'
  } else {
    if (req.session.data.crop_group == 'leafy' || req.session.data.crop_group == 'root') {
      next = 'sample_depth'
      //arable
      } else if (req.session.data.crop_group == 'cereals' || req.session.data.crop_group == 'arable-other') {
        next = 'values'
      } else {
        next = 'organic_adjustment'
      }
  }
  res.redirect(next)
})

// add_sns/gai_height.html → gai or height
router.get(/gai_height_router/, function (req, res) {
    let next = (req.session.data.gai_height == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

// add_sns/crop_nitrogen.html → shoots (yes) or nitrogen_mineralisation (no)
router.get(/crop_nitrogen_router/, function (req, res) {
    let next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

// add_sns/nitrogen_mineralisation.html → sns_index (no) or organic_adjustment (yes)
router.get(/mineral_router/, function (req, res) {
    let next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
})

// add_sns/previous_grass.html → plough (yes, was grass) or check (no)
router.get(/add-grass-handler/, function (req, res) {
    let next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'check'
    res.redirect(next)
})

// split_merge.html → split/number (split) or merge/fields (merge)
router.get(/split_field_router/, function (req, res) {
    let next = (req.session.data.splitmerge == "split") ? './split/number' : './merge/fields'
    res.redirect(next)
})

// split/check.html → manage-fields (adds two hardcoded new fields from split)
router.get(/split_field_handler/, callback_functions.showSuccessMessage, function (req, res) {
    const fields = req.session.data.all_fields
    const originalId = req.session.data.chosen_field.field_id
    const fieldOneId = fields.length + 1
    const fieldTwoId = fields.length + 2

    const original = fields.find(f => f.field_id == originalId)
    if (original) {
        original.split_merged = 'ORIGINAL'
        original.split_into = [fieldOneId, fieldTwoId]
    }

    fields.push(
        { field_name: 'New Field One', field_id: fieldOneId, split_merged: 'SPLIT', split_merged_from: originalId },
        { field_name: 'New Field Two', field_id: fieldTwoId, split_merged: 'SPLIT', split_merged_from: originalId }
    )
    req.session.data.successMessage = 'FIELD_SPLIT'
    res.redirect('/management/farm/field/manage-fields')
})


module.exports = router
