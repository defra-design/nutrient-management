var express = require('express')
var router = express.Router()

let nextURL

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD A FARM *

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//start
router.get(/start_router/, function (req, res) {
  let next = (req.session.data.showinfo == false) ? '/farm/get_started' : '/disclaimer'
  res.redirect(next)
})

router.get(/add_farm_name_handler/, function (req, res) {
  if (req.session.data.farm_name != "") req.session.data.oaktree_farm.name = req.session.data.farm_name
  res.redirect('country')
})

router.get(/add_postcode_handler/, function (req, res) {
  if (req.session.data.farm_postcode != "") req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode
  res.redirect('address')
})

router.get(/set_nvz_handler/, function (req, res) {
  if (req.session.data.farm_nvz != "") req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz
  res.redirect('elevation')
})

router.get(/set_elevation_handler/, function (req, res) {
  if (req.session.data.farm_elevation != "") req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation
  res.redirect('organic')
})

//sets the farm to setup true
router.get(/add_farm_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 1 //farm added
    req.session.data.oaktree_farm.setup = true;
    res.redirect('/farm/hub');
})

//removes a farm
router.get(/delete_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 2 //farm removed
    req.session.data.oaktree_farm.setup = false;
    res.redirect('/farm/farms');
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD / MANAGE A FIELD

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//set the name for the field 
router.get(/set_field_name_handler/, function (req, res) { 
  req.session.data.temp_field = allFunctions.setFieldName(req.session.data.temp_field, req.session.data.temp_field_name, req.session.data.all_fields.length);
  res.redirect('./area')
})

//set field sizes
router.get(/field_size_router/, function (req, res) { 
  req.session.data.temp_field = allFunctions.setFieldSizes(req.session.data.temp_field, req.session.data.total_area, req.session.data.cropped_area, req.session.data.non_spreading_area);
  const farm = req.session.data.oaktree_farm;
  let next = farm.nvz === 'some' ? 'nvz' : (farm.elevation === 'some' ? 'elevation' : 'soil-one');
  res.redirect(next);
})

//check if the farm is over 300m
router.get(/nvz_router/, function (req, res) { 
    let next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil-one';
    res.redirect(next);
})

//add a soil analysis
router.get(/analysis_option_router/, function (req, res) { 
    let next = (req.session.data.soilanalysis == "yes") ? 'date' : 'previous_use'
    res.redirect(next)
})

//how do you want to add your values
router.get(/add_values_router/, function (req, res) { 
    let next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

//has the field been used for grass previously
router.get(/previous_use_router/, function (req, res) { 
    if (req.session.data.previously_grass == 'yes') {
        req.session.data.chosen_crop = 'Grass'
        res.redirect('previous_use_two')
    } else {
        res.redirect('crop_group')
    }
})

//which years was it used as grass
router.get(/grass_years_handler/, function (req, res) {
    let next = 'previous_lay'
    for (var item in req.session.data.grass_years) {
        if (req.session.data.grass_years[item] == '2025') {
            next = 'previous_cuts'
        }
    }
    res.redirect(next)
})

//add the field
router.get(/add_field_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 3 //field added
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.all_fields.push(req.session.data.temp_field);    
    
    //reset temp vars
    req.session.data.chosen_crop = req.session.data.total_area = req.session.data.cropped_area = req.session.data.non_spreading_area = null
    req.session.data.soiltype = req.session.data.field_nvz = req.session.data.field_alt = req.session.data.field_alt = null
    res.redirect('/farm/field/manage-fields');
})

router.get(/add_sns_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 17;
    req.session.data.chosen_group.sns = true;
    res.redirect('/farm/field_plan/index');
})

router.get(/copy_name_handler/, function (req, res) { 
  req.session.data.temp_field = allFunctions.setFieldName(req.session.data.temp_field, req.session.data.temp_field_name, req.session.data.all_fields.length);
  res.redirect('./analysis')
})

router.get(/field_update_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 4 //field updated
    res.redirect('/farm/field/field-details')
})

router.get(/soil_update_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 5 //soil updated
    res.redirect('/farm/field/field-details')
})

router.get(/soil_added_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 6 //soil added
    res.redirect('/farm/field/field-details')
})

router.get(/split_field_router/, function (req, res) { 
    let next = (req.session.data.splitmerge == "split") ? './split/number' : './merge/fields'
    res.redirect(next)
})

router.get(/copy_field_router/, function (req, res) { 
    req.session.data.show_success_message = false;
    let next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name';
    res.redirect(next)
})

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

router.get(/previous_clover_router/, function (req, res) { 
    let next = (req.session.data.previous_clover == "yes") ? 'check' : 'previous_nitrogen'
    res.redirect(next)
})

// router.get(/previous_cuts_router/, function (req, res) { 
//     let next = (req.session.data.previous_management == 'grazed') ? 'previous_clover' : 'previous_cuts_two'
//     res.redirect(next)
// })

router.get(/sns_v3_router/, function (req, res) { 
    let next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'check';
    res.redirect(next);
})

router.get(/mineralisation_router/, function (req, res) { 
    let next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/fieldtype_router/, function (req, res) { 
    let next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
    res.redirect(next)
})

router.get(/log_croptype_router/, function (req, res) {
	if (req.session.data.sns_method == "no") {
			res.redirect('../check')
	} else {
			if (req.session.data.crop_group == 'leafy' || req.session.data.crop_group == 'root') {
					res.redirect('sample_depth')
			//arable    
			} else if (req.session.data.crop_group == 'cereals' || req.session.data.crop_group == 'arable-other') {
					res.redirect('values')
			} else {
					res.redirect('organic_adjustment')
			}    
	}
})

router.get(/gaiheight_router/, function (req, res) { 
    let next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/crop_nitrogen_router/, function (req, res) { 
    let next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

router.get(/mineral_router/, function (req, res) { 
    let next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
})

router.get(/add-grass-handler/, function (req, res) { 
    let next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'check'
    res.redirect(next)
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADD A CROP

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(/start_plan_handler/, function (req, res) {
  req.session.data.oaktree_farm.planning_year = parseInt(req.query.date)
    res.redirect('/add_crops/crop_group')
})

//view the plan by year
router.get(/crop_plan_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = parseInt(req.query.date)
    res.redirect('./crop_plan/plan_view')
})

router.get(/update_question_handler/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    let next
    if (req.query.update_type == 'variety') {
        next = 'variety'
    }
    if (req.query.update_type == 'date') {
        next = 'date/date_question'
    }
    res.redirect(next)
})

router.get(/crop_group_update_v7_handler/, function (req, res) { 
  req.session.data.show_success_message = true;
  req.session.data.successMessage = 6;
  if (req.session.data.update_type == 'date') {
      //planting date update
      var tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
      for (var groupRef in req.session.data.cropGroups) {
          if (req.session.data.cropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
              req.session.data.cropGroups[groupRef].planting_date = tempDate
          }
      }
  }
  if (req.session.data.update_type == 'variety') {
      //variety update
      for (var groupRef in req.session.data.cropGroups) {
          if (req.session.data.cropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
              req.session.data.cropGroups[groupRef].variety = req.session.data.new_variety
          }
      }
  }
  //reset temp vars
  req.session.data.new_variety = req.session.data.new_planting_date_day = req.session.data.new_planting_date_month = req.session.data.new_planting_date_year = null
  res.redirect('/farm/crop_plan/plan_view')
})

router.get(/v5_fields_handler/, function (req, res) { 
    if (req.session.data.crop_fields === undefined) req.session.data.crop_fields = [1, 2, 11, 12, 13, 14, 15];
    req.session.data.crop_fields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_fields, req.session.data.all_fields)
    // if (req.session.data.crop_group == 'grass') {
    //     res.redirect('grass/current_sward')
    //  } else {
    //     res.redirect('group_name')
    // }
    // console.log(req.session.data.crop_fields)
    res.redirect('group_name')
})

router.get(/crops_V5_check_handler/, function (req, res) { 
    let yield = null
    let group_name = (req.session.data.groupname == null || req.session.data.groupname == '') ? 'Crop group ' + (req.session.data.cropGroups.length + 1) : req.session.data.groupname
    let year = req.session.data.oaktree_farm.planning_year
    let crop_id = req.session.data.chosen_crop
    let field_list = req.session.data.crop_fields
    let variety = null

    // create a group reference
    var group_id = req.session.data.cropGroups.length + 1

    // create a new group and add each field reference to the group
    var new_group = allFunctions.createCropGroup(group_name, group_id, year, crop_id, field_list, req.session.data.all_fields)
    
    // add crop details to each field
    req.session.data.all_fields = allFunctions.updateFieldCrop(req.session.data.all_fields, field_list, crop_id, year, variety, group_id)

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
    if (req.session.data.oaktree_farm.years_planned.length == 0) {
        req.session.data.oaktree_farm.years_planned.push(req.session.data.oaktree_farm.planning_year)
    } else {
        for (var y in req.session.data.oaktree_farm.years_planned) {
            if (req.session.data.oaktree_farm.planning_year != req.session.data.oaktree_farm.years_planned[y]) {
                req.session.data.oaktree_farm.years_planned.push(req.session.data.oaktree_farm.planning_year)
            }
        }
    }

    //reset vars and redirect
    yield = req.session.data.group_name = req.session.data.group_id = req.session.data.crop_id = req.session.data.field_list_data = null;
    res.redirect('/farm/crop_plan/plan_view')
})

router.get(/checkprompt_handler/, function (req, res) { 
  req.session.data.oaktree_farm.planning_year = parseInt(req.query.date)
  res.redirect('check_prompt')
})

router.get(/copyplan_handler/, function (req, res) {
  if (req.session.data.oaktree_farm.years_planned.length == 0) {
      req.session.data.oaktree_farm.years_planned.push(req.session.data.oaktree_farm.planning_year)
  } else {
      for (var y in req.session.data.oaktree_farm.years_planned) {
          if (req.session.data.oaktree_farm.planning_year != req.session.data.oaktree_farm.years_planned[y]) {
              req.session.data.oaktree_farm.years_planned.push(req.session.data.oaktree_farm.planning_year)
          }
      }
  }
  res.redirect('/farm/crop_plan/plan_view')
})

router.get(/grassyield_handler/, function (req, res) { 
	if (req.session.data.defoliation_one == null) req.session.data.defoliation_one = 'Grazing';
	if (req.session.data.defoliation_two == null) req.session.data.defoliation_two = 'Grazing';
	if (req.session.data.defoliation_three == null) req.session.data.defoliation_three = 'Grazing';
	if (req.session.data.defoliation_four == null) req.session.data.defoliation_four = 'Grazing';
	if (req.session.data.weight_type == null) req.session.data.weight_type = 'Fresh cut weight';
	res.redirect('add_crops/check')
})

router.get(/groupname_handler/, function (req, res) { 
    var newRef = req.session.data.cropGroups.length + 1
    if (req.session.data.groupname.length <= 0) req.session.data.groupname = 'Crop group ' + newRef;
    if (req.session.data.chosen_crop != 'grass') {
        res.redirect('variety')
    } else {
        res.redirect('grass/current_sward')
    }
})

router.get(/potato_type_handler/, function (req, res) { 
    res.redirect('fields')
})

router.get(/variety_handler/, function (req, res) { 
    // if (req.session.data.crop_group == 'potatoes') { 
    //     if (req.session.data.variety == '' || req.session.data.variety == null) {
    //         req.session.data.variety = 'Maris Piper'
    //     }
    //     req.session.data.chosen_crop = req.session.data.variety + " potato"
    // } 
    res.redirect('sowdate_question')
})

router.get(/create_next_handler/, function (req, res) { 
  req.session.data.oaktree_farm.planning_year = parseInt(req.query.date)
  res.redirect('/add_crops/create_next')
})

router.get(/v4_plancopy_router/, function (req, res) { 
  let next = '/add_crops/crop_group'
  if (req.session.data.plan_copy == 'yes') next = '/add_crops/copy/copy_year';
  res.redirect(next)
})

// ALPHA // add second crops 
router.get(/another_crop_router/, function (req, res) { 
  let next = (req.session.data.second_crop == 'new') ? 'crop_group' : 'second_crop/fields'
  res.redirect(next)
})

// BETA // add second crops 
router.get(/mvp_another_crop_router/, function (req, res) { 
  if (req.session.data.crop_group == 'other') {
    if (req.session.data.other_selected == 'yes') {
        res.redirect('name_two')
    } else {
        res.redirect('check')
    }
  } else {
    if (req.session.data.cover_crop == 'none') {
        res.redirect('check')
    } else {
        res.redirect('variety_two')
    }
  }
})

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

router.get(/crop_use_handler/, function (req, res) { 
    let next = 'crop_use'
    if (req.session.data.crop_group == 'potatoes') {
        next = 'growth'
    }
    res.redirect(next)
})

router.get(/v7_grass_yield_handler/, callback_functions.default_grass_values, function (req, res) { 
    res.redirect('../check');
})

router.get(/yield_questiontwo_router/, function (req, res) { 
    let next = (req.session.data.yield_option_two != 'rb209') ? 'yield_value_two' : 'check';
    res.redirect(next);
})

router.get(/yield_handler/, function (req, res) { 
    let next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/sowdate_value_router/, function (req, res) { 
  if (req.session.data.crop_group != 'grass') {
      if (req.session.data.sow_option_one != 'no') {
          next = 'sowdate_value'
      } else {
          next = 'yield_question'
      }
  } else {
      if (req.session.data.sow_option_one != 'no') {
          next = 'sowdate_value'
      } else {
          next = 'sward_type'
      }
  }
  res.redirect(next);
})

router.get(/sowdatetwo_value_router/, function (req, res) { 
  let next = (req.session.data.sow_option_two != 'no') ? 'sowdate_value_two' : 'yield_question_two';
  res.redirect(next);
})

router.get(/crop_choice_router/, function (req, res) { 
    if (req.session.data.crop_group == 'grass') { 
        req.session.data.chosen_crop = 'grass'
        res.redirect('fields')
    } else if (req.session.data.crop_group == 'potatoes') { 
        req.session.data.chosen_crop = 'potatoes'
        res.redirect('crop_type_potato')
    } else if (req.session.data.crop_group == null) { 
        req.session.data.crop_group = 'cereals'
        res.redirect('crop_type_all')
    } else {
        res.redirect('crop_type_all')
    }
})

router.get(/mvp_crop_handler/, function (req, res) { 
    // if (req.session.data.crop_group == 'potatoes') { 
    //     res.redirect('crop_type_potato')
    // }
    if (req.session.data.chosen_crop == null || req.session.data.chosen_crop == '')  {
        if (req.session.data.crop_group == 'other') {
            req.session.data.chosen_crop = 'Flax'
        } else {
            req.session.data.chosen_crop = 'Winter Wheat'
        }
    }
    res.redirect('fields')
})

router.get(/manner_crop_handler/, function (req, res) { 
    // if (req.session.data.crop_group == 'potatoes') { 
    //     res.redirect('crop_type_potato')
    // }
    console.log(req.session.data.chosen_crop)
    let next = 'manure_group'
    if (req.session.data.chosen_crop == null || req.session.data.chosen_crop == '')  {
        if (req.session.data.crop_group == 'other') {
            req.session.data.chosen_crop = 'Flax'
        } else {
            req.session.data.chosen_crop = 'Winter Wheat'
        }
        if (req.session.data.chosen_crop == 'Winter Wheat' || req.session.data.chosen_crop == 'Wheat-Winter') {
            next = 'wheat_sown'
        }
    }
    res.redirect(next)
})

router.get(/season_router/, function (req, res) { 
    let next = (req.session.data.reseed == "yes" || req.session.data.reseed == "new" ) ? 'season' : 'sowdate_question'
    res.redirect(next)
})

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

router.get(/yield_total_router/, function (req, res) { 
    let next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
    res.redirect(next)
})

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

router.get(/def_sequence_handler/, function (req, res) { 
    let next = '../check'
    if (req.session.data.sward_type == 'grass') {
            next = 'yield_value_v5'
        }
    res.redirect(next)
})

router.get(/yield_loop_handler/, function (req, res) { 
    let next = (req.session.data.crop_fields[1] == null) ? '../check' : 'yield_value_v5a'
    res.redirect(next)
})

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

router.get(/addcrops_handler/, function (req, res) { 
    req.session.data.secondcrop_journey = true
    res.redirect('add_crops/another_crop')
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//UPDATE ROUTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(/manure_update_handler/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    req.session.data.chosen_application = req.query.application_id
    req.session.data.chosen_field_id = req.query.field
    let next = '/update/manure/update'
    res.redirect(next)
})

router.get(/manure_update_v6_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 13;
    let next = '/farm/crop_plan/plan_view'
    res.redirect(next)
})

router.get(/fertiliser_update_v6_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 14;
    let next = '/farm/crop_plan/plan_view'
    res.redirect(next)
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//MANAGE PLANS

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// navigate from whole plan to filed level
router.get(/field_level_plan_v5_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
  req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref) 
  res.redirect('../field_plan/index')
})

router.get(/group_level_plan_v7_handler/, function (req, res) { 
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//MANAGE MANURES

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(/v2_quantity_handler/, function (req, res) { 
    let next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'manure_incorporation_method';
    res.redirect(next);
})

router.get(/manner_quantity_handler/, function (req, res) { 
    let next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'results';
    res.redirect(next);
})

router.get(/manure_fields_v5_handler/, function (req, res) {
    let next = 'manure_group'
    if (req.session.data.manure_field_option == 'specific') {
      next = 'manure_fields_two'
    } else if (req.session.data.manure_field_option == 'all') {
      for (var x in req.session.data.cropGroups) {
        for (var y in req.session.data.cropGroups[x].field_list ) {
          req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[x].field_list[y])
        }
      }
    } else {
      for (var a in req.session.data.cropGroups) {
        if (req.session.data.cropGroups[a].group_id == req.session.data.manure_field_option) {
          for (var b in req.session.data.cropGroups[a].field_list ) {
            req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[a].field_list[b])
          }
        }
      }
    }
    res.redirect(next)
})

router.get(/manuretype_v7_handler/, function (req, res) {
    req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
    let next = 'manure_date'
    if (req.session.data.oaktree_farm.grass_setup == true) {
        next = 'manure_defoliation'
    }
    res.redirect(next)
})

router.get(/manuretype_manner_handler/, function (req, res) {
    req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_types, req.session.data.manure_type)
    res.redirect('manure_date')
})

router.get(/manure_date_v5_handler/, function (req, res) {
    if (req.session.data.manure_date_day < 1) {
        req.session.data.manure_date_day = 21
    }
    if (req.session.data.manure_date_month < 1) {
        req.session.data.manure_date_month = 2
    }
    if (req.session.data.manure_date_year < 1) {
        req.session.data.manure_date_year = 2024
    }
        // if (req.session.data.manure_type.liquid == true) {
    //     res.redirect("manure_applied")
    // } else {
    //     res.redirect("manure_defaults")
    // }
    if (req.session.data.manure_type.liquid == true) {
        res.redirect("manure_applied")
    } else {
        res.redirect("manure_defaults")
    }
})

router.get(/add_manure_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    let group_id = req.session.data.manureApplications.length + 1
    let manure_id = req.session.data.manure_type.name
    let year = req.session.data.oaktree_farm.planning_year
    let field_list = req.session.data.chosen_manure_fields
    let application_date = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year

    // let manureType = req.session.data.manure_type.name
    // let manure_fields = req.session.data.manure_fields
    // let manureDate = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year

    for (let x in field_list) {
			let applicationGroup = allFunctions.add_manure_application (group_id, year, field_list[x], application_date, manure_id)
			req.session.data.manureApplications.push(applicationGroup)
    }
    group_id = manure_id = year = field_list = application_date = req.session.data.manure_fields = null
    req.session.data.successMessage = 2
    
    console.log(req.session.data.manureApplications)
    res.redirect('/farm/crop_plan/plan_view')
})

router.get(/plan_manure_application_router/, function (req, res) { 
    let nextURL
    req.session.data.manure_journey = req.query.manurejourney
    if (req.session.data.manure_journey == 'multi') {
        nextURL = '/add_manure/manure_fields'
    } else {
        req.session.data.manure_fields = []
        req.session.data.manure_fields.push(req.session.data.chosen_field.field_id)
        nextURL = '/add_manure/manure_group'
    }
    res.redirect(nextURL)
})

router.get(/manuregroup_handler/, callback_functions.setManureGroup, function (req, res) { 
    res.redirect("manure_type")
})

router.get(/enter_manure_defualts_handler/, function (req, res) {
    let next = (req.session.data.edit_manure_defaults === "no") ? 'manure_defaults_update' : 'manure_quantity';
    res.redirect(next);
})

router.get(/fertiliser_remove_router/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 15
    res.redirect('/farm/crop_plan/plan_view')
})

router.get(/fertiliser_change_router/, callback_functions.getApplicationByReference, function (req, res) { 
    res.redirect('/update/fertiliser/update')
})  

router.get(/manuredate_handler/, function (req, res) { 
  if (req.query.notification == 'true') {
      req.session.data.show_manure_notification = true
  }
  res.redirect('/add_manure/manure_datenotification')
})

router.get(/livestock_type_v7_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_type_livestock_data, req.session.data.manure_type)
	res.redirect("manure_date")
})

router.get(/livestock_type_export_handler/, function (req, res) {
  req.session.data.manure_type = allFunctions.getByReference(req.session.data.manure_type_livestock_data, req.session.data.manure_type)
	res.redirect("date")
})

router.get(/incorporation_handler/, function (req, res) {
    let next = (req.session.data.incorporation_method == "not_incorporated") ? 'rain_defaults' : 'manure_delay'
    res.redirect(next)
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//MANAGE FERTILISERS

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(/fertiliser_when_handler/, function (req, res) { 
  res.redirect('defoliation')
})

router.get(/v2fertiliser_handler/, function (req, res) { 
	req.session.data.fertiliser_journey = req.query.fertiliserjourney
	if (req.session.data.fertiliser_journey == 'multi') {
			res.redirect('/add_fertiliser/fertiliser_fields')
	} else {
			res.redirect('/add_fertiliser/fertiliser_when')
	}
})

router.get(/fertiliser_loop_handler/, function (req, res) { 
	if (req.session.data.fertiliser_loop == 'no') {
			res.redirect('check')
	} else {
			req.session.data.fertiliser_count++
			res.redirect('fertiliser_when')
	}
})

//select a field
router.get(/field-select-handler/, callback_functions.hideSuccessMessage, function (req, res) { 
  req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field) 
	res.redirect('/farm/field/field-details')
})

// router.get(/v5_fertiliser_handler/, function (req, res) {
//   let next = 'fertiliser_when'
//   if (req.session.data.fertiliser_fields_option == 'specific') {
//     next = 'fertiliser_fields_two'
//   } else if (req.session.data.fertiliser_fields_option == 'all') {
//     for (var x in req.session.data.cropGroups) {
//       for (var y in req.session.data.cropGroups[x].field_list ) {
//         req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[x].field_list[y])
//       }
//     }
//   } else {
//     for (var a in req.session.data.cropGroups) {
//       if (req.session.data.cropGroups[a].group_id == req.session.data.fertiliser_fields_option) {
//         for (var b in req.session.data.cropGroups[a].field_list ) {
//           req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[a].field_list[b])
//         }
//       }
//     }
//   }
//   res.redirect(next)
// })

router.get(/v5_fertiliser_handler/, function (req, res) {
	let next = 'fertiliser_when'
	if (req.session.data.fertiliser_fields_option == 'specific') {
			next = 'fertiliser_fields_two'
	} else if (req.session.data.fertiliser_fields_option == 'all') {
		for (var x in req.session.data.cropGroups) {
			for (var y in req.session.data.cropGroups[x].field_list ) {
				req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[x].field_list[y])
			}
		}
	} else {
		for (var a in req.session.data.cropGroups) {
			if (req.session.data.cropGroups[a].group_id == req.session.data.fertiliser_fields_option) {
				for (var b in req.session.data.cropGroups[a].field_list ) {
					req.session.data.chosen_manure_fields.push(req.session.data.cropGroups[a].field_list[b])
				}
			}
		}
	}
	res.redirect(next)
})

//set fertiliser
router.get(/fertiliser_v5_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 3
    var fertiliserDate = req.session.data.fertiliser_date_day + '/' + req.session.data.fertiliser_date_month + '/' + req.session.data.fertiliser_date_year
    var ref
    for (var x in req.session.data.chosen_manure_fields) {
      for (var appl in req.session.data.fertiliserApplications) {
          ref = req.session.data.fertiliserApplications[appl].ref +1
      }
      // function addFertiliserApplication_v2 (group_id, year, field_id, date, nitrogen, phosphate, potash, sulphur, lime) {
      var applicationGroup = allFunctions.addFertiliserApplication_v2 (
          1, //temp group id
          req.session.data.oaktree_farm.planning_year,
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
    let next = '/farm/crop_plan/plan_view'
    // if (req.session.data.fertiliser_journey == "multi") {
    //    next = '/farm/crop_plan/plan_view'
    // }
    res.redirect(next)
})

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

router.get(/fertiliser_date_handler/, function (req, res) {
    if (req.session.data.fertiliser_date_day < 1) req.session.data.fertiliser_date_day = 21;
    if (req.session.data.fertiliser_date_month < 1) req.session.data.fertiliser_date_month = 2;
    if (req.session.data.fertiliser_date_year < 1) req.session.data.fertiliser_date_year = 2024;
    res.redirect("fertiliser_amount")
})

// router.get(/change_cropgroup_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
//     req.session.data.chosen_group = allFunctions.getByReference(req.session.data.cropGroups, req.query.groupref)
//     req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)
//     req.session.data.chosen_crop_group = allFunctions.getByReference(req.session.data.crop_types_data, req.session.data.chosen_group.crop_reference)
//     res.redirect('change_crop')
// })

router.get(/rainfall_update_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 12;
    req.session.data.oaktree_farm.ewr = req.session.data.excess_rain
    res.redirect('/farm/crop_plan/plan_view')
})

router.get(/update_variety/, function (req, res) {
    // req.session.data.chosen_crop_group.variety = req.session.data.new_variety
    // req.session.data.show_success_message = true  
    res.redirect('../change_crop')
})

module.exports = router