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
  let next = (req.session.data.showinfo == false) ? 'management/farm/farms' : 'disclaimer'
  res.redirect(next)
})

// start.html (plan/estimate choice) → farm hub, MANNER about page, or previous calculations
router.get(/plan_estimate_router/, function (req, res) {
  let next
  if (req.session.data.farm.setup == true) {
    next = '/management/farm/farms'
  } else {
    next = '/management/farm/about_nmpt'
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
    req.session.data.successMessage = 1 //farm added
    req.session.data.farm.setup = true;
    res.redirect('/management/farm/hub');
})

// management/farm/remove.html → farms list (marks farm as removed)
router.get(/delete_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 2 //farm removed
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
    let next = (req.session.data.soilanalysis == "yes") ? 'soil-two' : 'previous_use'
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
    let next = 'previous_lay'
    for (var item in req.session.data.grass_years) {
        if (req.session.data.grass_years[item] == '2025') {
            next = 'previous_cuts'
        }
    }
    res.redirect(next)
})

// add-field/check.html → manage-fields (saves the field and resets temp vars)
router.get(/add_field_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //field added
    req.session.data.farm.fields_added = true;
    req.session.data.all_fields.push(req.session.data.temp_field);
    //reset temp vars
    req.session.data.chosen_crop = req.session.data.total_area = req.session.data.cropped_area = req.session.data.non_spreading_area,
    req.session.data.soiltype = req.session.data.field_nvz = req.session.data.field_alt = null
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
    let next = 'crop_type_all'
    if (req.session.data.crop_group == null) {
        req.session.data.crop_group = 'cereals'
    }
    if (req.session.data.crop_group == 'grass') {
        req.session.data.chosen_crop = 'Grass'
        next = 'previous-grass'
    }
    if (req.session.data.crop_group == 'herbs') {
        req.session.data.chosen_crop = 'Herbs'
        next = 'check'
    }
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop = 'Other'
        next = 'check'
    }
    res.redirect(next)
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
    res.redirect('/management/farm/field/field-details')
})


// =============================================================================
// SNS (SOIL NITROGEN SUPPLY)
// Routes for the SNS measurement journey within a field plan.
// =============================================================================

// add_sns/check.html → field_plan/index (saves SNS data to the chosen field)
router.get(/add_sns_handler/, function (req, res) {
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 17;
  req.session.data.chosen_field.sns = true;
  res.redirect('/management/farm/field_plan/index');
})

// add_sns/mineralisation.html → organic or adjustment
router.get(/mineralisation_router/, function (req, res) {
    let next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

// add_sns/croptype.html → sample_depth, values, or organic_adjustment depending on crop group
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

// add_sns/gaiheight.html → gai or height
router.get(/gaiheight_router/, function (req, res) {
    let next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
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
  req.session.data.successMessage = 6;
  if (req.session.data.update_type == 'date') {
      //planting date update
      let tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
      for (let groupRef in req.session.data.cropGroups) {
          if (req.session.data.cropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
              req.session.data.cropGroups[groupRef].planting_date = tempDate
          }
      }
  }
  if (req.session.data.update_type == 'variety') {
      //variety update
      for (let groupRef in req.session.data.cropGroups) {
          if (req.session.data.cropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
              req.session.data.cropGroups[groupRef].variety = req.session.data.new_variety
          }
      }
  }
  //reset temp vars
  req.session.data.new_variety = req.session.data.new_planting_date_day = req.session.data.new_planting_date_month = req.session.data.new_planting_date_year = null
  res.redirect('/management/farm/crop_plan/plan_view')
})

// add_crops/fields.html → group_name (resolves field references to full field objects)
router.get(/get_crop_fields_handler/, function (req, res) {
    if (req.session.data.crop_fields === undefined) req.session.data.crop_fields = [1, 2, 11, 12, 13, 14, 15];
    req.session.data.crop_fields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_fields, req.session.data.all_fields)
    res.redirect('group_name')
})

// add_crops/check.html → plan_view (creates the crop group and adds it to cropGroups)
router.get(/add_crops_check_handler/, function (req, res) {
    let cropYield = null
    let group_name = (req.session.data.groupname == null || req.session.data.groupname == '') ? 'Crop group ' + (req.session.data.cropGroups.length + 1) : req.session.data.groupname
    let year = req.session.data.farm.planning_year
    let crop_id = req.session.data.chosen_crop
    let field_list = req.session.data.crop_fields
    let variety = null

    // create a group reference
    let group_id = req.session.data.cropGroups.length + 1

    // create a new group and add each field reference to the group
    var new_group = allFunctions.createCropGroup(group_name, group_id, year, crop_id, field_list)

    // add crop details to each field
    req.session.data.all_fields = allFunctions.updateFieldCrop(req.session.data.all_fields, field_list, crop_id, variety, group_id)

    // add this group to all crop groups
    req.session.data.cropGroups.push(new_group)

    //show the correct success message
    req.session.data.show_success_message = true;
    if (req.session.data.chosen_crop == 'grass') {
        req.session.data.successMessage = 16
    } else {
        req.session.data.successMessage = 1
    }

    //update the years planned array
    allFunctions.addYearIfMissing(req.session.data.farm.years_planned, req.session.data.farm.planning_year)

    //reset vars and redirect
    cropYield = req.session.data.group_name = req.session.data.group_id = req.session.data.crop_id = req.session.data.field_list_data = null;
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
router.get(/groupname_handler/, function (req, res) {
    let newRef = req.session.data.cropGroups.length + 1
    if (req.session.data.groupname.length <= 0) req.session.data.groupname = 'Crop group ' + newRef;
    if (req.session.data.chosen_crop != 'grass') {
        res.redirect('variety')
    } else {
        res.redirect('grass/current_sward')
    }
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

// add_crops/crop_use.html → crop_use (non-potato) or growth (potato)
router.get(/crop_use_handler/, function (req, res) {
    let next = 'crop_use'
    if (req.session.data.crop_group == 'potatoes') {
        next = 'growth'
    }
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
    if (req.session.data.chosen_crop == null || req.session.data.chosen_crop == '')  {
        if (req.session.data.crop_group == 'other') {
            req.session.data.chosen_crop = 'Flax'
        } else {
            req.session.data.chosen_crop = 'Winter Wheat'
        }
    }
    res.redirect('fields')
})

// manner/crop_type.html → manure_group or sowing_date (Winter Wheat)
router.get(/manner_crop_handler/, function (req, res) {
    let next = 'manure_group'
    if (req.session.data.chosen_crop == null || req.session.data.chosen_crop == '')  {
        if (req.session.data.crop_group == 'other') {
            req.session.data.chosen_crop = 'Flax'
        } else {
            req.session.data.chosen_crop = 'Winter Wheat'
            next = 'wheat_sown'
        }
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
    if (req.session.data.grass_management == 'grazing') {
        req.session.data.defoliations = 'grazings'
    } else if (req.session.data.grass_management == 'hay' || req.session.data.grass_management == 'silage') {
        req.session.data.defoliations = 'cuts'
    } else  {
        req.session.data.defoliations = 'cuts and grazings'
    }
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
// UPDATE ROUTES
// Routes that handle updates to existing crop, manure or fertiliser records.
// =============================================================================

// plan_view → update/manure/update (sets the update context from URL params)
router.get(/manure_update_router/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    req.session.data.chosen_application = req.query.application_id
    req.session.data.chosen_field_id = req.query.field
    let next = '/update/manure/update'
    res.redirect(next)
})

// update/manure/check.html → plan_view#organic (saves manure update)
router.get(/manure_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 13;
    let next = '/management/farm/crop_plan/plan_view#organic'
    res.redirect(next)
})

// update/fertiliser/check.html → plan_view (saves fertiliser update)
router.get(/fertiliser_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 14;
    let next = '/management/farm/crop_plan/plan_view'
    res.redirect(next)
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
  req.session.data.chosen_group = req.query.groupref
  req.session.data.chosen_year = req.query.year
  //group.reference
  req.session.data.chosen_group = allFunctions.getByReference(req.session.data.cropGroups, req.query.group_id)
  req.session.data.show_success_message = false
  let next = '/update/crop/change_crop'
  if (req.session.data.chosen_group.crop_reference == 'grass') {
      next = '/update/grass/change_crop'
  }
  res.redirect(next)
})


// =============================================================================
// MANAGE MANURES
// Routes for the add-manure journey (fields → group → type → date → defaults
// → quantity → incorporation → check your answers) and for updating existing applications.
// =============================================================================

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
      req.session.data.chosen_manure_fields = allFunctions.collectFieldsFromGroups(req.session.data.cropGroups, req.session.data.manure_field_option)
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
router.get(/add_manure_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let group_id = req.session.data.manureApplications.length + 1
    let manure_id = req.session.data.manure_type.name
    let year = req.session.data.farm.planning_year
    let field_list = req.session.data.chosen_manure_fields
    let application_date = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year
        for (let x in field_list) {
            let applicationGroup = allFunctions.add_manure_application (group_id, year, field_list[x], application_date, manure_id)
            req.session.data.manureApplications.push(applicationGroup)
    }

    group_id = manure_id = year = field_list = application_date = req.session.data.manure_fields = null
    req.session.data.successMessage = 2

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

// plan_view (remove link) → plan_view (removes fertiliser application, shows success banner)
router.get(/fertiliser_remove_router/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 15
    res.redirect('/management/farm/crop_plan/plan_view')
})

// plan_view (change link) → update/fertiliser/update (loads the application to edit)
router.get(/fertiliser_change_router/, callback_functions.getApplicationByReference, function (req, res) {
    res.redirect('/update/fertiliser/update')
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

// reports/add_export/type.html (livestock) → date (resolves livestock type reference for export)
router.get(/livestock_type_export_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_type_livestock_data, req.session.data.manure_type)
    res.redirect("date")
})

// add_manure/incorporation.html → rain_defaults (not incorporated) or manure_delay (incorporated)
router.get(/incorporation_handler/, function (req, res) {
    let next = (req.session.data.incorporation_method == "not_incorporated") ? 'rain_defaults' : 'manure_delay'
    res.redirect(next)
})


// =============================================================================
// MANAGE FERTILISERS
// Routes for the add-fertiliser journey (fields → when → amount → date → check your answers).
// =============================================================================

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
        req.session.data.chosen_manure_fields = allFunctions.collectFieldsFromGroups(req.session.data.cropGroups, req.session.data.fertiliser_fields_option)
    }
    res.redirect(next)
})

// add_fertiliser/check.html → plan_view#inorganic (creates a fertiliser application record for each field)
router.get(/add_fertiliser_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let fertiliserDate = req.session.data.fertiliser_date_day + '/' + req.session.data.fertiliser_date_month + '/' + req.session.data.fertiliser_date_year
    let field_list = req.session.data.chosen_manure_fields
    let next = '/management/farm/crop_plan/plan_view#inorganic'

    for (let x in field_list) {
      let applicationGroup = allFunctions.addFertiliserApplication_v2(
          1, //temp group id
          req.session.data.farm.planning_year,
          req.session.data.chosen_manure_fields[x],
          fertiliserDate,
          req.session.data.nitrogen,
          req.session.data.phosphate,
          req.session.data.potash,
          req.session.data.sulphur,
          req.session.data.lime
      )
      req.session.data.fertiliserApplications.push(applicationGroup)
    }
    req.session.data.chosen_manure_fields = []
    req.session.data.successMessage = 3

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

// add_fertiliser/date.html → fertiliser_amount (with date validation fallbacks)
router.get(/fertiliser_date_handler/, function (req, res) {
    if (req.session.data.fertiliser_date_day < 1) req.session.data.fertiliser_date_day = 21;
    if (req.session.data.fertiliser_date_month < 1) req.session.data.fertiliser_date_month = 2;
    if (req.session.data.fertiliser_date_year < 1) req.session.data.fertiliser_date_year = 2026;
    res.redirect("fertiliser_amount")
})

// update/rainfall/update.html → plan_view (saves the excess winter rainfall value)
router.get(/rainfall_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 12;
    req.session.data.farm.ewr = req.session.data.excess_rain
    res.redirect('/management/farm/crop_plan/plan_view')
})

// update/crop/change_crop.html (variety tab) → change_crop
router.get(/update_variety/, function (req, res) {
    res.redirect('../change_crop')
})

module.exports = router
