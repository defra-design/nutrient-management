var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// =============================================================================
// ADD A CROP
// Routes for the add-crop journey (crop group → crop type → fields → group name
// → variety → sow date → yield → check your answers) and for updating existing crop groups.
// =============================================================================

// plan hub → add_crops/crop_group (sets the planning year from the URL)
router.get(/start_plan_handler/, function (req, res) {
  req.session.data.farm.planning_year = parseInt(req.query.date)
  res.redirect('/planning/add_crops/crop_group')
})

// plan hub (year tabs) → plan_view (switches the visible planning year)
router.get(/crop_plan_year_handler/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.farm.planning_year = parseInt(req.query.date)
  res.redirect('./crop_plan/plan_view')
})

// update/crop/change_crop.html → variety or date/date_question
router.get(/update_question_handler/, function (req, res) {
  req.session.data.update_type = req.query.update_type
  let next = 'variety'
  if (req.query.update_type == 'date') {
      next = 'date/date_question'
  }
  res.redirect(next)
})

// update/crop/check.html → plan_view (saves planting date or variety change to the crop group)
router.get(/crop_group_update_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 'CROP_PLAN_PLAN_UPDATED';
  if (req.session.data.update_type == 'date') {
    //planting date update
    let tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
    for (let groupRef in req.session.data.planned_crop_groups) {
      if (req.session.data.planned_crop_groups[groupRef].reference == req.session.data.chosen_group.reference) {
        req.session.data.planned_crop_groups[groupRef].planting_date = tempDate
      }
    }
  }
  if (req.session.data.update_type == 'variety') {
    //variety update
    for (let groupRef in req.session.data.planned_crop_groups) {
      if (req.session.data.planned_crop_groups[groupRef].reference == req.session.data.chosen_group.reference) {
          req.session.data.planned_crop_groups[groupRef].variety = req.session.data.new_variety
      }
    }
  }
  //reset temp vars
  req.session.data.new_variety = req.session.data.new_planting_date_day = req.session.data.new_planting_date_month = req.session.data.new_planting_date_year = null
  res.redirect('/management/farm/crop_plan/plan_view')
})

// add_crops/fields.html → group_name
router.get(/get_crop_fields_handler/, function (req, res) {
    if (req.session.data.crop_fields === undefined) req.session.data.crop_fields = [1, 2, 11, 12, 13, 14, 15];
    res.redirect('group_name')
})

// add_crops/check.html → plan_view (creates the crop group and adds it to planned_crop_groups)
router.get(/add_crops_check_handler/, function (req, res) {
  const group_name = !req.session.data.group_name ? 'Crop group ' + (req.session.data.planned_crop_groups.length + 1) : req.session.data.group_name
  const year = req.session.data.farm.planning_year
  const crop_id = req.session.data.chosen_crop
  const field_list = req.session.data.crop_fields
  const group_id = req.session.data.planned_crop_groups.length + 1

  const new_group = allFunctions.createCropGroup(group_name, group_id, year, crop_id, field_list)
  req.session.data.all_fields = allFunctions.updateFieldCrop(req.session.data.all_fields, field_list, crop_id, null, group_id)
  req.session.data.planned_crop_groups.push(new_group)

  req.session.data.show_success_message = true
  req.session.data.successMessage = (crop_id == 'grass') ? 'CROP_PLAN_GRASS_ADDED' : 'CROP_PLAN_CROPS_ADDED'

  allFunctions.addYearIfMissing(req.session.data.farm.years_planned, year)

  req.session.data.group_name = null
  req.session.data.group_id = null
  req.session.data.crop_id = null
  req.session.data.field_list_data = null
  res.redirect('/management/farm/crop_plan/plan_view')
})

// plan hub → check_prompt (sets planning year before showing the plan prompt screen)
router.get(/checkprompt_handler/, function (req, res) {
  req.session.data.farm.planning_year = parseInt(req.query.date)
  res.redirect('check_prompt')
})

// add_crops/copy/check.html → plan_view (adds the copied year to years_planned)
router.get(/copyplan_handler/, function (req, res) {
  allFunctions.addYearIfMissing(req.session.data.farm.years_planned, req.session.data.farm.planning_year)
  res.redirect('/management/farm/crop_plan/plan_view')
})

// add_crops/grass/yield_value.html → check (sets default defoliation types if not already set)
router.get(/grassyield_handler/, function (req, res) {
    if (req.session.data.defoliation_one == null) req.session.data.defoliation_one = 'Grazing';
    if (req.session.data.defoliation_two == null) req.session.data.defoliation_two = 'Grazing';
    if (req.session.data.defoliation_three == null) req.session.data.defoliation_three = 'Grazing';
    if (req.session.data.defoliation_four == null) req.session.data.defoliation_four = 'Grazing';
    if (req.session.data.weight_type == null) req.session.data.weight_type = 'Fresh cut weight';
    res.redirect('/planning/add_crops/check')
})

// add_crops/group_name.html → variety (non-grass) or grass/current_sward (grass)
router.get(/group_name_handler/, function (req, res) {
  let newRef = req.session.data.planned_crop_groups.length + 1
  if (req.session.data.group_name.length <= 0) {
    req.session.data.group_name = 'Crop group ' + newRef
  }
  const next = req.session.data.chosen_crop != 'grass' ? 'variety' : 'grass/current_sward'
  res.redirect(next)
})

// add_crops/crop_type_potato.html → fields
router.get(/potato_type_handler/, function (req, res) {
  res.redirect('fields')
})

// add_crops/variety.html → sowdate_question
router.get(/variety_handler/, function (req, res) {
  res.redirect('sowdate_question')
})

// plan hub → create_next (sets planning year before showing the create-next-year screen)
router.get(/create_next_handler/, function (req, res) {
  req.session.data.farm.planning_year = parseInt(req.query.date)
  res.redirect('/planning/add_crops/create_next')
})

// add_crops/create_next.html → crop_group (new plan) or copy/copy_year (copy existing)
router.get(/v4_plancopy_router/, function (req, res) {
  let next = '/planning/add_crops/crop_group'
  if (req.session.data.plan_copy == 'yes') next = '/planning/add_crops/copy/copy_year';
  res.redirect(next)
})

// add_crops/yield_question.html → check, yield_value, growth, or crop_use depending on crop type
router.get(/yield_question_router/, function (req, res) {
  let next = 'check'
  if (req.session.data.yield_option_one != 'rb209') {
    next = 'yield_value'
  } else {
    if (req.session.data.crop_group == 'potatoes') {
      next = 'growth'
    }
    if (req.session.data.crop_group == 'cereals') {
      next = 'crop_use'
    }
  }
  res.redirect(next)
})

// add_crops/crop_use.html → growth (potato) or crop_use (everything else)
router.get(/crop_use_handler/, function (req, res) {
  const next = req.session.data.crop_group == 'potatoes' ? 'growth' : 'crop_use'
  res.redirect(next)
})

// add_crops/yield_question_two.html → yield_value_two or check
router.get(/yield_questiontwo_router/, function (req, res) {
  let next = (req.session.data.yield_option_two != 'rb209') ? 'yield_value_two' : 'check';
  res.redirect(next);
})

// add_crops/yield_value.html → check (Turnips-stubble) or crop_use (everything else)
router.get(/yield_handler/, function (req, res) {
  let next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
  res.redirect(next)
})

// add_crops/sowdate_question.html → sowdate_value or yield_question / sward_type depending on crop group
router.get(/sowdate_value_router/, function (req, res) {
  let next = 'sowdate_value'
  if (req.session.data.sow_option_one == 'no') {
    if (req.session.data.crop_group == 'grass') {
      next = 'sward_type'
    } else {
      next = 'yield_question'
    }
  }
  res.redirect(next);
})

// add_crops/sowdate_question_two.html → sowdate_value_two or yield_question_two
router.get(/sowdatetwo_value_router/, function (req, res) {
  let next = (req.session.data.sow_option_two != 'no') ? 'sowdate_value_two' : 'yield_question_two';
  res.redirect(next);
})

// add_crops/crop_group.html → crop_type_all, fields (grass/potato), or defaults to cereals
router.get(/crop_choice_router/, function (req, res) {
  let next ='crop_type_all'
  if (req.session.data.crop_group == 'grass') {
    req.session.data.chosen_crop = 'grass'
    next = 'fields'
  } else if (req.session.data.crop_group == 'potatoes') {
    req.session.data.chosen_crop = 'potatoes'
    next = 'crop_type_potato'
  } else if (req.session.data.crop_group == null) {
    req.session.data.crop_group = 'cereals'
  }
    res.redirect(next)
})

// add_crops/crop_type_all.html → fields (sets a default crop if none chosen)
router.get(/mvp_crop_handler/, function (req, res) {
  if (!req.session.data.chosen_crop) {
    req.session.data.chosen_crop = req.session.data.crop_group == 'other' ? 'Flax' : 'Winter Wheat'
  }
  res.redirect('fields')
})

// manner/crop_type.html → manure_group or sowing_date (Winter Wheat)
router.get(/manner_crop_handler/, function (req, res) {
  let next = 'manure_group'
  if (!req.session.data.chosen_crop) {
    req.session.data.chosen_crop = req.session.data.crop_group == 'other' ? 'Flax' : 'Winter Wheat'
  }
  if (req.session.data.chosen_crop == 'Winter Wheat' || req.session.data.chosen_crop == 'Wheat-Winter') {
    next = 'sowing_date'
  }
  res.redirect(next)
})

// add_crops/grass/current_sward.html → season (reseeding) or sowdate_question (established)
router.get(/season_router/, function (req, res) {
  let next = (req.session.data.reseed == "yes" || req.session.data.reseed == "new" ) ? 'season' : 'sowdate_question'
  res.redirect(next)
})

// add_crops/grass/management.html → defoliation (sets the defoliations label based on management type)
router.get(/grass_management_router/, function (req, res) {
  const defoliationLabel = {
    grazing: 'grazings',
    hay: 'cuts',
    silage: 'cuts',
  }
  req.session.data.defoliations = defoliationLabel[req.session.data.grass_management] || 'cuts and grazings'
  res.redirect('defoliation')
})

// add_crops/grass/yield_total.html → fresh_yield (multi) or yield_fresh_single (single)
router.get(/yield_total_router/, function (req, res) {
  let next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
  res.redirect(next)
})

// add_crops/grass/management.html (mixed grazing) → defoliation_order or yield_value_v5 or check
router.get(/management_grass_router/, function (req, res) {
  let next = '../check'
  if (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") {
      next = 'defoliation_order'
  } else {
      if (req.session.data.sward_type == 'grass') {
          next = 'yield_value_v5'
      }
  }
  res.redirect(next)
})

// add_crops/grass/defoliation_order.html → yield_value_v5 or check
router.get(/def_sequence_handler/, function (req, res) {
  let next = '../check'
  if (req.session.data.sward_type == 'grass') {
    next = 'yield_value_v5'
  }
  res.redirect(next)
})

// add_crops/grass/yield_value_v5a.html → check (last field) or yield_value_v5a (next field in loop)
router.get(/yield_loop_handler/, function (req, res) {
  let next = (req.session.data.crop_fields[1] == null) ? '../check' : 'yield_value_v5a'
  res.redirect(next)
})

// add_crops/grass/weight_type.html → yield_value_dry, fresh_yield, or yield_total
router.get(/weight_type_router/, function (req, res) {
  let next = 'yield_value_dry';
  if (req.session.data.yield_type == "fresh") {
    if (req.session.data.grass_management == 'grazinghay' || req.session.data.grass_management == 'grazingsilage' ) {
      next = 'fresh_yield'
    } else {
      next = 'yield_total'
    }
  }
  res.redirect(next)
})

// plan_view/add_crops → another_crop (sets secondcrop_journey flag and starts the second-crop flow)
router.get(/addcrops_handler/, function (req, res) {
  req.session.data.secondcrop_journey = true
  res.redirect('/planning/add_crops/another_crop')
})


// =============================================================================
// MANAGE PLANS
// Routes for navigating between the whole-plan view and field or group level.
// =============================================================================

// plan_view → field_plan/index (sets chosen_field from URL param and goes to field-level plan)
router.get(/view_field_plan_router/, callback_functions.hideSuccessMessage, function (req, res) {
  req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)
  res.redirect('../field_plan/index')
})

// plan_view → update/crop/change_crop or update/grass/change_crop (sets chosen_group from URL param)
router.get(/crop_update_router/, function (req, res) {
  req.session.data.chosen_year = req.query.year
  req.session.data.chosen_group = allFunctions.getByReference(req.session.data.planned_crop_groups, req.query.group_id)
  req.session.data.show_success_message = false
  const next = req.session.data.chosen_group.crop_reference == 'grass' ? '/update/grass/change_crop' : '/update/crop/change_crop'
  res.redirect(next)
})

// update/rainfall/update.html → plan_view (saves the excess winter rainfall value)
router.get(/rainfall_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
  req.session.data.successMessage = 'CROP_PLAN_RAINFALL_UPDATED';
  req.session.data.farm.ewr = req.session.data.excess_rain
  res.redirect('/management/farm/crop_plan/plan_view')
})

// update/crop/change_crop.html (variety tab) → change_crop
router.get(/update_variety/, function (req, res) {
  res.redirect('../change_crop')
})


module.exports = router
