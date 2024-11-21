var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

/////////////////////////////
////////// ADD FARM /////////
/////////////////////////////

router.get(/organic_handler/, function (req, res) { 
    //name
    if (req.session.data.farm_name == "") {
        req.session.data.farm_name = 'Oaktree Lane Farm';
    }
    //postcode
    if (req.session.data.farm_postcode == "") {
        req.session.data.farm_postcode = 'NE46 7LQ';
    }
    //NVZ
    if (req.session.data.farm_nvz == "") {
        req.session.data.farm_nvz = 'all';
    }
    //elevation
    if (req.session.data.farm_elevation == "") {
        req.session.data.farm_elevation = 'none';
    }
    //organic
    // if (req.session.data.organic_producer == "" || req.session.data.organic_producer == 'no' ) {
    //     req.session.data.organic_producer = false;
    // } else {
    //     req.session.data.organic_producer = true;
    // }  
    res.redirect('check');
})

//creates a farm
router.get(/add_farms_handler/, function (req, res) { 
    //name
    req.session.data.oaktree_farm.name = req.session.data.farm_name;
    //postcode
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode;
    //NVZ
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz;
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation;
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer ;
    req.session.data.oaktree_farm.setup = true;
    req.session.data.oaktree_farm.latest_update = 'added';
    req.session.data.show_success_message = true;
    // console.log(req.session.data.oaktree_farm)
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub');
})


// Alert messages
router.get(/delete_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.setup = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/farms');
})

//farm view reset messages
router.get(/hub_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/hub');
})

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) {
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/manage-fields');
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version + '/add-field/name');
})

//add a field view reset messages
router.get(/copy_field_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    var next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name';
    res.redirect(next)
})

//add a field view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/field-details');
})

//plan_view reset messages
router.get(/planview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('../crop_plan/plan_view');
})


/////////////////////////////
////////// ADD FIELD /////////
/////////////////////////////

router.get(/add-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.show_success_message = true;
    req.session.data.all_fields.push(req.session.data.tempField);

    req.session.data.plan_2023.setup = true;
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter';
    req.session.data.plan_2023.firstFieldReferences.push(req.session.data.tempField.reference);
    req.session.data.plan_2023.firstFields = req.session.data.all_fields;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/manage-fields');
})

router.get(/soil_type_handler/, function (req, res) { 
    if (req.session.data.oaktree_farm.nvz == 'some' ) {
        res.redirect('nvz');
    } else if (req.session.data.oaktree_farm.elevation == 'some') {
        res.redirect('elevation');
    } else {
        res.redirect('soil-one');
    }
})

router.get(/nvz_handler/, function (req, res) { 
    var next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil-one';
    res.redirect(next);
})

router.get(/cropuse_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'other') { 
        res.redirect('another_crop');
    } else {
        res.redirect('crop_use');
    }
})

router.get(/field_name_handler/, function (req, res) { 
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference;
    }
    req.session.data.tempField.name = req.session.data.temp_field_name;
    res.redirect('./area');
})

router.get(/add_values_handler/, function (req, res) { 
    var next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

router.get(/sns_handler/, function (req, res) { 
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'sns/crop_group'
    res.redirect(next)
    res.redirect('sns/crop_group')
})

router.get(/sns_v3_handler/, function (req, res) { 
    var next = 'check'
    if (req.session.data.sns_method == "yes") {
        next = 'sns/date'
    }
    res.redirect(next)
})

router.get(/mineralisation_handler/, function (req, res) { 
    var next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/previous_group_handler/, function (req, res) { 
    var next = 'crop_type_all'
    if (req.session.data.crop_group == null) {
        req.session.data.crop_group = 'cereals'
    }
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop = 'Other'
    } 
    if (req.session.data.crop_group == 'grass') {
        req.session.data.chosen_crop = 'Grass'
        next = 'previous-grass'
    } 
    res.redirect(next)
})

router.get(/log_croptype_handler/, function (req, res) {
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

router.get(/organicadjustment_handler/, function (req, res) { 
    if (req.session.data.chosen_crop == "Oilseed-Spring" || req.session.data.chosen_crop == "Oilseed-Winter") {
        res.redirect('gai_height')
    } else if (req.session.data.crop_group == "cereals" || req.session.data.crop_group == 'arable-other') {
        res.redirect('shoots')
    } else {
        res.redirect('/add-field/check')
    }
})

router.get(/gaiheight_handler/, function (req, res) { 
    var next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/fieldtype_handler/, function (req, res) { 
    var next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
    res.redirect(next)
})

router.get(/copy_name_handler/, function (req, res) { 
    // req.session.data.tempField.name = (req.session.data.temp_field_name == '') ? 'New Field' : req.session.data.temp_field_name
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference 
    }
    req.session.data.tempField.name = req.session.data.temp_field_name
    res.redirect('./copy-field-check')
})

router.get(/crop_nitrogen_handler/, function (req, res) { 
    var next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

router.get(/mineral_handler/, function (req, res) { 
    var next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
})

router.get(/field_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.latest_update = 'field_updated'
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/field-details')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
//////// ADD CROPS //////////
/////////////////////////////


router.get(/mvp_another_crop_handler/, function (req, res) { 
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

router.get(/mvp_fields_handler/, function (req, res) { 
    if (req.session.data.secondcrop_journey == true) {
        for (var x in req.session.data.crop_fields) {
            for (var y in req.session.data.all_fields) {
                if (req.session.data.all_fields[y].reference == req.session.data.crop_fields[x]) {
                    req.session.data.plan_2024.secondFieldReferences.push(req.session.data.crop_fields[x])
                    req.session.data.plan_2024.secondFields.push(req.session.data.all_fields[y])
                }
            }
        }    
    } else {
        for (var a in req.session.data.crop_fields) {
            for (var b in req.session.data.all_fields) {
                if (req.session.data.all_fields[b].reference == req.session.data.crop_fields[a]) {
                    req.session.data.plan_2024.firstFieldReferences.push(req.session.data.crop_fields[a])
                    req.session.data.plan_2024.firstFields.push(req.session.data.all_fields[b])
                }
            }
        }    
    }
    // console.log(req.session.data.firstFieldReferences)
    if (req.session.data.crop_group == 'grass') {
        res.redirect('grass/current_sward')
     } else {
        res.redirect('sowdate_question')
    }
})

router.get(/v5_fields_handler/, function (req, res) { 
    if (req.session.data.crop_fields === undefined) {
        req.session.data.crop_fields = [11, 12, 13, 14, 15]
    }
    req.session.data.crop_fields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_fields, req.session.data.all_fields)
    // if (req.session.data.crop_group == 'grass') {
    //     res.redirect('grass/current_sward')
    //  } else {
    //     res.redirect('group_name')
    // }
    res.redirect('group_name')
})

router.get(/cover_handler/, function (req, res) { 
    req.session.data.crop_group_2024.secondCropFields = []
    for (var x in req.session.data.cover_fields) {
        for (var y in req.session.data.all_fields) {
            if (req.session.data.all_fields[y].reference == req.session.data.cover_fields[x]) {
                req.session.data.cover_fields[x] = req.session.data.all_fields[y]
            }
        }
    }
    res.redirect('sowdate_two')
})

router.get(/yield_question_handler/, function (req, res) { 
    var next = 'check'
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

router.get(/yield_questiontwo_handler/, function (req, res) { 
    if (req.session.data.yield_option_two != 'rb209') {
        res.redirect('yield_value_two')
    } else {
        res.redirect('check')
    }
})

router.get(/yield_handler/, function (req, res) { 
    var next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/sowdate_value_handler/, function (req, res) { 
    if (req.session.data.sow_option_one != 'no') {
        res.redirect('sowdate_value')
    } else {
        res.redirect('yield_question')
    }
})

router.get(/sowdatetwo_value_handler/, function (req, res) { 
    if (req.session.data.sow_option_two != 'no') {
        res.redirect('sowdate_value_two')
    } else {
        res.redirect('yield_question_two')
    }
})

router.get(/addcrops_check_handler/, function (req, res) { 
    req.session.data.oaktree_farm.plans_added = true;
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 1;
    req.session.data.plan_2024.setup = true
    if(req.session.data.secondcrop_journey == true) {
        req.session.data.plan_2024.secondCropReference = req.session.data.chosen_crop
        // req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)    
    } else {
        req.session.data.plan_2024.firstCropReference = req.session.data.chosen_crop
        // req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    }
    req.session.data.oaktree_farm.planning_year = 2024;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/crops_V5_check_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    var sowdate = null;
    req.session.data.successMessage = 1;
    var newRef = req.session.data.cropGroupsV5.length + 1
    if (req.session.data.sow_date_day != null) {
        sowdate = req.session.data.sow_date_day + '/' + req.session.data.sow_date_month + '/' + req.session.data.sow_date_year
    }
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(newRef, 2024, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname, sowdate))
    req.session.data.groupname = null;
    req.session.data.variety = null;
    req.session.data.sow_date_day = null;
    req.session.data.sow_date_month = null;
    req.session.data.sow_date_year = null;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})


/////////////////////////////
//////// ADD MANURES ////////
/////////////////////////////

router.get(/v2manure_handler/, function (req, res) { 
    req.session.data.manure_journey = req.query.manurejourney
    if (req.session.data.manure_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_fields')
    } else {
        req.session.data.manure_fields = []
        req.session.data.manure_fields.push(req.session.data.chosen_field.reference)
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_group')
    }
})

router.get(/v3manure_journey_handler/, function (req, res) { 
    req.session.data.manure_journey = req.query.manurejourney
    res.redirect('/' + req.session.data.prototype_version + '/add_manure/application_choice')
})

router.get(/v3manure_choice_handler/, function (req, res) { 
    if (req.session.data.manure_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_fields')
    } else {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_group')
    }
})

router.get(/add_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
})

router.get(/version2_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 2
    if (req.session.data.manure_journey == 'multi') {
        req.session.data.plan_2024.multipleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
    } else {
        req.session.data.plan_2024.singleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/field_plan/index')
    }
})

router.get(/version5_manure_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 4
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/manureagain_handler/, function (req, res) { 
    if (req.session.data.manureagain == "yes") {
        req.session.data.manure_count++
        // console.log(req.session.data.manure_count)
        res.redirect('manure_date')
    } else {
        res.redirect('check')
    }
})   

router.get(/manurecheck_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/version_2/add_manure/check')
})

router.get(/manuredate_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/version_2/add_manure/manure_datenotification')
})

router.get(/manuregroup_handler/, function (req, res) { 
    if (req.session.data.manure_group_id == "livestock") {
        req.session.data.manure_types = req.session.data.manure_types_livestock
    } else if (req.session.data.manure_group_id == "biosolids") {
        req.session.data.manure_types = req.session.data.manure_types_biosolid
    } else if (req.session.data.manure_group_id == "other") {
        req.session.data.manure_types = req.session.data.manure_types_other
    } else if (req.session.data.manure_group_id == "digestate") {
        req.session.data.manure_types = req.session.data.manure_types_digestate
    }
    res.redirect("manure_type")
})

router.get(/manuretype_handler/, function (req, res) {
    //get object
    if (req.session.data.manure_group_id != 'livestock') {
        for (var x in req.session.data.manure_types ) {
            if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
                req.session.data.manure_type = req.session.data.manure_types[x]
            }
        }
    }
    var next = "manure_date"
    if (req.session.data.manure_group_id == "livestock") {
        next = "livestock_type"
        if (req.session.data.manure_type == "dirty_water" ||
            req.session.data.manure_type == "horse_fym" || 
            req.session.data.manure_type == "goat_fym" ||
            req.session.data.manure_type == "poultry") {
            next = "manure_date"
            //get object
            for (var a in req.session.data.manure_types_livestock ) {
                if (req.session.data.manure_types_livestock[a].type == req.session.data.manure_type) {
                    req.session.data.manure_type = req.session.data.manure_types_livestock[a]
                }
            }
        }
    }
    res.redirect(next)
})

router.get(/livestock_type_handler/, function (req, res) {
    // console.log(req.session.data.manure_type)
    //get object
    for (var x in req.session.data.manure_types_livestock) {
        if (req.session.data.manure_types_livestock[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types_livestock[x]
        }
    }
    res.redirect("manure_date")
})

router.get(/incorporation_handler/, function (req, res) {
    if (req.session.data.incorporation_method == 'not_incorporated') {
        res.redirect("rain_defaults")
    } else {
        res.redirect("manure_delay")
    }
})

router.get(/enter_manure_defualts_handler/, function (req, res) {
    if (req.session.data.edit_manure_defaults === "no") {
        res.redirect("manure_defaults_update")
    } else {
        res.redirect("manure_quantity")
    }
})

// router.get(/manuredate_handler/, function (req, res) { 
//     if (req.session.data.manure_count == 0) {
//         res.redirect('manure_group')
//     } else {
//         res.redirect('manure_again')
//     }
// })

//////////////////////////////////
//////// ADD FERTILISERS /////////
//////////////////////////////////


router.get(/v2fertiliser_handler/, function (req, res) { 
    req.session.data.fertiliser_journey = req.query.fertiliserjourney
    if (req.session.data.fertiliser_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_fertiliser/fertiliser_fields')
    } else {
        res.redirect('/' + req.session.data.prototype_version + '/add_fertiliser/fertiliser_when')
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

//CHECK
router.get(/version2_fertiliser_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 3
    req.session.data.fertiliser_count = 0
    if (req.session.data.fertiliser_journey == 'multi') {
        req.session.data.plan_2024.multipleFertilisersApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
    } else {
        req.session.data.plan_2024.singleFertilisersApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/field_plan/index') 
    }
})

router.get(/fertiliser_v5_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 5
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//Set the chosen_field OBJECT
router.get(/create_plan_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.query.chosen_field) {
            req.session.data.chosen_field = req.session.data.field_details[y]
        }
    }
    if (req.session.data.chosen_field.planStatus == "crop_added") {
        req.session.data.chosen_crop = req.session.data.chosen_field.crop
        if (req.session.data.chosen_field.crop == "grass") {
            res.redirect('grass/current_sward')
        } else {
            res.redirect('crop_when')
        }
    } else {
        res.redirect('create')
    }
})

// router.get(/view_plan_handler/, function (req, res) { 
//     for ( var y in req.session.data.field_details ) {
//         if(req.session.data.field_details[y].reference === req.query.chosen_field) {
//             req.session.data.chosen_field = req.session.data.field_details[y]
//         }
//     }
//     res.redirect('/old/create/plan')
// })

//how do you want to create your plan? 
router.get(/plan-type-handler/, function (req, res) { 
    if (req.session.data.plan_type == "previous") {
        req.session.data.crop_group = "Arable cereals"
        req.session.data.chosen_crop = "Wheat-Winter"
        res.redirect('check_last_year')
    } else if (req.session.data.plan_type == "other") {
        res.redirect('other_plan')
    } else {
        //new
    res.redirect('use')
    }
})

//grass or arable?
router.get(/crop_type_handler/, function (req, res) { 
    if (req.session.data.field_use == "arable") {
        res.redirect('crop_group')
    } else {
        req.session.data.chosen_crop = "grass"
        res.redirect('grass/current_sward')
    }
})

//do you plan to spread manure?
router.get(/manure_if_handler/, function (req, res) { 
    var next = (req.session.data.manure_if == "yes") ? 'manure_when' : 'check_one'
    res.redirect(next)
})

//manure application loops
router.get(/manure_counter_updater/, function (req, res) { 
    req.session.data.manure_spreads++
    res.redirect('manure_type')
})

// //do you plan to spread manure multiple times
// router.get(/manure_again_handler/, function (req, res) { 
// if (req.session.data.manure_again == "yes") {
//     res.redirect('manure_when')
// } else {
//     if (req.session.data.plan_type == "new") {
//         res.redirect('check_one')
//     } else {
//         res.redirect('set_status')
//     }
// }
// })

// //set the plan status
// router.get(/set_status/, function (req, res) { 
//     for ( var y in req.session.data.field_details ) {
//         if (req.session.data.field_details[y].reference === req.session.data.chosen_field.reference) {
//             if (req.session.data.plan_type == "previous") {
//                 req.session.data.field_details[y].planStatus = 'recommendations'
//             } else {
//                 req.session.data.field_details[y].planStatus = 'Plan complete'
//             }
//             req.session.data.field_details[y].crop = req.session.data.chosen_crop
//         }
//     }
//     req.session.data.farm_details.plan_status = 'new';
//     res.redirect('fields')
// })

// update the status of the plan for chosen_field to nul, recs, full

//set the status to recommendations
router.get(/recs_status_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosen_field.reference) {
            req.session.data.field_details[y].planStatus = 'recommendations'
            req.session.data.field_details[y].crop = req.session.data.chosen_crop
        }
    }
    req.session.data.farm_details.plan_status = "recommendations"
    res.redirect('/old/create/recs')
})

//FERTILISER
////////////

//do you plan to spread fertiliser?
router.get(/fertiliser_if_handler/, function (req, res) { 

    if (req.session.data.fertiliser_if == "yes") {
        if( req.session.data.chosen_crop == 'grass') {
            res.redirect('./grass/inorganic_defoliation')

        } else {
            res.redirect('fertiliser_when')
        }
    } else {
        res.redirect('check')
    }
})

//do you plan to spread more fertiliser
router.get(/fertiliser_again_handler/, function (req, res) { 
    var next = (req.session.data.fertiliser_again == "yes") ? 'fertiliser_when' : 'check'
    res.redirect(next)
})

//manure application loops
router.get(/fertiliser_counter_updater/, function (req, res) { 
    req.session.data.fertiliser_spreads++
    res.redirect('fertiliser_type')
})
    
//fertiliser application types loop
router.get(/fertiliser_types_handler/, function (req, res) { 
    var chosen_nutrients = req.session.data.chosen_nutrients
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    for (var x in chosen_nutrients) {
        if (chosen_nutrients[x] == "nitrogen") {
            req.session.data.chosen_nitrogen = true;
        } else if (chosen_nutrients[x] == "phosphate") {
            req.session.data.chosen_phosphate = true;
        } else if (chosen_nutrients[x] == "potash") {
            req.session.data.chosen_potash = true;
        } else if (chosen_nutrients[x] == "sulphur") {
            req.session.data.chosen_sulphur = true;
        } else if (chosen_nutrients[x] == "lime") {
            req.session.data.chosen_lime = true;
        }
    }
    res.redirect('fertiliser_amount_table')
})

//crop 
router.get(/crop_group_handler/, function (req, res) { 
    if (req.session.data.crop_group == "other") {
        res.redirect('crop_when')
    } else {
        res.redirect('crop_type_all')
    }
})

router.get(/cropmvp_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'grass') { 
        req.session.data.chosen_crop = 'grass'
        res.redirect('fields')
    } else if (req.session.data.crop_group == 'potatoes') { 
        res.redirect('crop_type_potato')
    } else if (req.session.data.crop_group == null) { 
        req.session.data.crop_group = 'cereals'
        res.redirect('crop_type_all')
    } else {
        res.redirect('crop_type_all')
    }
})

/////// MVP Crops
//Set the chosen_crop
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
    res.redirect('variety')
})

router.get(/variety_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'potatoes') { 
        if (req.session.data.variety == '' || req.session.data.variety == null) {
            req.session.data.variety = 'Maris Piper'
        }
        req.session.data.chosen_crop = req.session.data.variety + " potato"
    } 
    res.redirect('fields')
})

router.get(/groupname_handler/, function (req, res) { 
    var newRef = req.session.data.cropGroupsV5.length + 1
    if (req.session.data.groupname.length <= 0) {
        req.session.data.groupname = 'Crop group ' + newRef
    }
    if (req.session.data.chosen_crop != 'grass') {
        res.redirect('sowdate_question')
    } else {
        res.redirect('grass/current_sward')
    }
})


//potatoes
router.get(/potato_type_handler/, function (req, res) { 
    // for (var x in req.session.data.potato_details) {
    //     if (req.session.data.potato_details[x].potatoVarietyId == req.session.data.chosen_crop) {
    //         req.session.data.chosen_crop = req.session.data.potato_details[x].potatoVariety + " potatoes"
    //     }
    // }
    req.session.data.chosen_crop = req.session.data.chosen_crop + " potato"
    res.redirect('fields')
})

//grass
router.get(/grass_use_handler/, function (req, res) { 
    res.redirect('arable_length')
})

//Set the chosen_crop OBJECT
router.get(/chosen_crop_handler/, function (req, res) { 
    // for ( var y in req.session.data.crop_types ) {
    //     if(req.session.data.field_details[y].reference === req.query.chosen_field) {
    //         req.session.data.chosen_field = req.session.data.field_details[y]
    //     }
    // }
    res.redirect('crop_when')
})

//multi-add status handler
router.get(/add_multi_handler/, function (req, res) { 
    for (var x in req.session.data.chosen_fields) {
        for (var y in req.session.data.field_details) {
            if (req.session.data.field_details[y].reference == req.session.data.chosen_fields[x] ) {
                req.session.data.field_details[y].planStatus = "crop_added"
                req.session.data.field_details[y].crop = req.session.data.chosen_crop
            }
        }
    }
    req.session.data.chosen_fields = []
    res.redirect('../fields')
})

//add field - grass history - handler
router.get(/add-grass-handler/, function (req, res) { 
    var next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'check'
    res.redirect(next)
})

router.get(/field-cuts-handler/, function (req, res) { 
    var next = (req.session.data.previous_management == 'grazing') ? 'previous-nitrogen' : 'previous-cuts'
    res.redirect(next)
})

router.get(/show-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.fields_added = true;
    res.redirect('../field/manage-fields')
})

///////////
///////  V2
///////////


router.get(/v2_quantity_handler/, function (req, res) { 
    if (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") {
        res.redirect('manure_value')
    } else {
        res.redirect('manure_incorporation_method')
    }
})

//add another
router.get(/v2_another_crop_handler/, function (req, res) { 
    if (req.session.data.another_crop == "yes") {
        res.redirect('crops_grass')
    } else {
        req.session.data.another_crop = 'no';
        res.redirect('check')
    }
})

// select plan type
router.get(/v2_plan_handler/, function (req, res) { 
    if (req.session.data.v2_plan_type == 'new') {
        req.session.data.plan_type = 'new'
        res.redirect('old/v2/old/plan/crops')
    } else {
        req.session.data.plan_type = 'previous'
        res.redirect('old/v2/old/plan/check')
    }
})

//add crop
router.get(/v2_check_handler/, function (req, res) { 
    if (req.session.data.plan_type == 'previous') {
        req.session.data.plan2025.plan_update = 'previous_created'
        req.session.data.plan2025.crop_added = true
        req.session.data.plan2025.manure_added = true
        req.session.data.plan2025.fertiliser_added = true
    } else {
        req.session.data.plan2025.plan_status = 'crop_added';
        req.session.data.plan2025.crop_added = true
    }
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('old/v2/crop_plan/index')
})

//view the plan by year
router.get(/crop_plan_year_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    res.redirect('./crop_plan/plan_view')
})

//view the selected plan
router.get(/field_level_plan_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // console.log('req.query.chosen_field ' + req.query.chosen_field)
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field)
    // console.log(req.session.data.chosen_field)
    req.session.data.chosen_crop = req.query.chosencrop
    res.redirect('../field_plan/index')
})

router.get(/field_level_plan_v5_handler/, function (req, res) { 
    req.session.data.chosen_group = req.query.fieldref
    req.session.data.chosen_field = req.query.groupref
    // console.log(req.session.data.chosen_group)
    // console.log(req.session.data.chosen_field)
    //group.reference 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.cropGroupsV5, req.query.groupref)
    //field reference
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)    
    req.session.data.show_success_message = false    
    res.redirect('../field_plan/index')
})


router.get(/mvpfield_plan_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field.reference)
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.cover_crop = req.query.covercrop
    res.redirect('../field_plan/index')
})

//add manure
router.get(/v2_manure_check_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field.reference)
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.cover_crop = req.query.covercrop
    res.redirect('old/v2/crop_plan/index')
})

//add fertiliser
router.get(/v2_check_fertiliser_handler/, function (req, res) { 
    req.session.data.plan2025.fertiliser_added = true
    req.session.data.plan2025.plan_update = 'fertiliser_added'
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('old/v2/crop_plan/index')
})

//change crop plan
router.get(/crop_change_handler/, function (req, res) { 
    var next = (req.session.data.change_crop == 'add_fertiliser') ? '../old/plan/fertiliser/fertiliser_when' : '../old/plan/add_manure/manure_fields'
    res.redirect(next)
})

//show the right fertilisers
router.get(/fertiliser_type_handler_v2/, function (req, res) { 
    var chosen_nutrients = req.session.data.chosen_nutrients
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    for (var x in chosen_nutrients) {
        if (chosen_nutrients[x] == "nitrogen") {
            req.session.data.chosen_nitrogen = true;
        } else if (chosen_nutrients[x] == "phosphate") {
            req.session.data.chosen_phosphate = true;
        } else if (chosen_nutrients[x] == "potash") {
            req.session.data.chosen_potash = true;
        } else if (chosen_nutrients[x] == "sulphur") {
            req.session.data.chosen_sulphur = true;
        } else if (chosen_nutrients[x] == "lime") {
            req.session.data.chosen_lime = true;
        }
    }
    res.redirect('fertiliser_amount')
})

//select a field
router.get(/field-select-handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.chosen_field = req.query.chosen_field
    res.redirect('field-details')
})

//update soil
router.get(/add_soil_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.latest_update = 'soil-added'
    res.redirect('../field/field-details')
})

router.get(/planning_year_handler/, function (req, res) { 
    var next = '/add_crops/crop_group'
    req.session.data.oaktree_farm.planning_year = req.query.year
    if (req.session.data.prototype_version == 'version_3' || req.session.data.prototype_version == 'version_4') {
        next = '/add_crops/create_next'
    }
    res.redirect('/'+ req.session.data.prototype_version + next)
})

router.get(/v4_plancopy_handler/, function (req, res) { 
    // if (req.session.data.plan_copy == 'new') {
    //     res.redirect('crop_group')
    // } else {
    //     res.redirect('check')
    // }
    res.redirect('crop_group')
})

router.get(/condition_question_handler/, function (req, res) { 
    req.session.data.condition_question = req.query.question
    res.redirect('condition_question')
})

router.get(/addcrops_handler/, function (req, res) { 
    req.session.data.secondcrop_journey = true
    res.redirect('/'+ req.session.data.prototype_version + '/add_crops/another_crop')
})

router.get(/foragecrops_check_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.plan_2024.forageCrop = true;
    req.session.data.oaktree_farm.planning_year = 2024;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//grass
router.get(/grassyield_handler/, function (req, res) { 
    if (req.session.data.defoliation_one == null) {
        req.session.data.defoliation_one = 'Grazing'
    }
    if (req.session.data.defoliation_two == null) {
        req.session.data.defoliation_two = 'Grazing'
    }
    if (req.session.data.defoliation_three == null) {
        req.session.data.defoliation_three = 'Grazing'
    }
    if (req.session.data.defoliation_four == null) {
        req.session.data.defoliation_four = 'Grazing'
    }
    if (req.session.data.weight_type == null) {
        req.session.data.weight_type = 'Fresh cut weight'
    }
    res.redirect('/'+ req.session.data.prototype_version + '/add_crops/check')
})

router.get(/previous_use_handler/, function (req, res) { 
    if (req.session.data.use_2023 == 'yes') {
        req.session.data.chosen_crop = 'Grass'
        res.redirect('previous_use_two')
    } else {
        res.redirect('crop_group')
    }
})
 
router.get(/another_crop_handler/, function (req, res) { 
    var next = (req.session.data.second_crop == 'new') ? 'crop_group' : 'second_crop/fields'
    res.redirect(next)
})

router.get(/previous_cuts_handler/, function (req, res) { 
    var next = (req.session.data.previous_management == 'grazed') ? 'previous_nitrogen' : 'previous_cuts_two'
    res.redirect(next)
})

router.get(/v5_fertiliser_handler/, function (req, res) {
    var new_fertiliser_fields = []
    var next = 'fertiliser_when'
    if (req.session.data.fertiliser_fields == 'specific') {
        next = 'fertiliser_fields_two'
    } else if (req.session.data.fertiliser_fields == 'all') {
        for (var x in req.session.data.cropGroupsV5) {
            for (var y in req.session.data.cropGroupsV5[x].fields ) {
                new_fertiliser_fields.push(req.session.data.cropGroupsV5[x].fields[y].reference)
                req.session.data.fertiliser_fields = new_fertiliser_fields
            }
        }
    } else {
        for (var a in req.session.data.cropGroupsV5) {
            if (req.session.data.cropGroupsV5[a].reference == req.session.data.fertiliser_fields ) {
                for (var b in req.session.data.cropGroupsV5[a].fields ) {
                    new_fertiliser_fields.push(req.session.data.cropGroupsV5[a].fields[b].reference)
                    req.session.data.fertiliser_fields = new_fertiliser_fields
                }
            }
        }
    }
    res.redirect(next)
})

router.get(/manure_fields_v5_handler/, function (req, res) {
    var new_manure_fields = []
    if (req.session.data.manure_fields == 'specific') {
        res.redirect('manure_fields_two')
    } else if (req.session.data.manure_fields == 'all') {
        for (var x in req.session.data.cropGroupsV5) {
            for (var y in req.session.data.cropGroupsV5[x].fields ) {
                new_manure_fields.push(req.session.data.cropGroupsV5[x].fields[y].reference)
                req.session.data.manure_fields = new_manure_fields
            }
        }
        res.redirect('manure_group')
    } else {
        for (var a in req.session.data.cropGroupsV5) {
            if (req.session.data.cropGroupsV5[a].reference == req.session.data.manure_fields ) {
                for (var b in req.session.data.cropGroupsV5[a].fields ) {
                    new_manure_fields.push(req.session.data.cropGroupsV5[a].fields[b].reference)
                    req.session.data.manure_fields = new_manure_fields;
                }
            }
        }
        res.redirect('manure_group')
    }
})

router.get(/version5_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 2
    var manureType = req.session.data.manure_type.name
    var manure_fields = req.session.data.manure_fields
    var manureDate = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.cropGroupsV5, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    manure_fields = null
    req.session.data.manure_fields = null
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/fertiliser_v5_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 3
    var fertiliserDate = req.session.data.fertiliser_date_day + '/' + req.session.data.fertiliser_date_month + '/' + req.session.data.fertiliser_date_year
    var fertiliser_fields = req.session.data.fertiliser_fields
    for (var x in fertiliser_fields) {
        var applicationGroup = allFunctions.addFertiliserApplication_v2 (
            req.session.data.all_fields, 
            req.session.data.cropGroupsV5, 
            fertiliser_fields[x], 
            fertiliserDate, 
            req.session.data.nitrogen, 
            req.session.data.phosphate, 
            req.session.data.potash, 
            req.session.data.sulphur, 
            req.session.data.lime 
        )
        req.session.data.allFertiliserApplications.push(applicationGroup)
    }
    var next = '/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view'
    if (req.session.data.fertiliser_journey == "multi") {
        next = '/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view'
    }
    res.redirect(next)
})

router.get(/manure_date_handler/, function (req, res) {
    if (req.session.data.manure_date_day < 1) {
        req.session.data.manure_date_day = 21
    }
    if (req.session.data.manure_date_month < 1) {
        req.session.data.manure_date_month = 2
    }
    if (req.session.data.manure_date_year < 1) {
        req.session.data.manure_date_year = 2024
    }
    if (req.session.data.manure_type.liquid == true) {
        res.redirect("manure_applied")
    } else {
        res.redirect("manure_defaults")
    }
})

router.get(/fertiliser_date_handler/, function (req, res) {
    if (req.session.data.fertiliser_date_day < 1) {
        req.session.data.fertiliser_date_day = 21
    }
    if (req.session.data.fertiliser_date_month < 1) {
        req.session.data.fertiliser_date_month = 2
    }
    if (req.session.data.fertiliser_date_year < 1) {
        req.session.data.fertiliser_date_year = 2024
    }
    res.redirect("fertiliser_amount")
})

router.get(/crops_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 6;
    // console.log('reference' + req.session.data.chosen_group.reference)
    for (var x in req.session.data.cropGroupsV5) {
        if (req.session.data.cropGroupsV5[x].reference == req.session.data.chosen_group.reference ) {
            req.session.data.cropGroupsV5[x].planting_date = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
            // console.log('date' + req.session.data.cropGroupsV5[x].planting_date)
        }
    }
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/export_handler/, function (req, res) { 
    var nmaxAddress = './outputs/nmax_report_v2'
    var workbookAddress = './outputs/workbook'
    var next = ('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
    if (req.session.data.export_type == 1) {
        next = 'export_fields'
    } else if (req.session.data.export_type == 2) {
        next = workbookAddress
    } else {
        next = nmaxAddress
    }
    res.redirect(next)
        // if (req.session.data.export_type == 1) {
    //     next = 'export_fields'
    // } else {
    //     req.session.data.show_success_message = true;
    //     if (req.session.data.export_type == 2) {
    //         req.session.data.successMessage = 8;
    //     } else if (req.session.data.export_type == 3) {
    //         req.session.data.successMessage = 9;
    //     } else if (req.session.data.export_type == 4) {
    //         req.session.data.successMessage = 10;
    //     } else if (req.session.data.export_type == 5) {
    //         req.session.data.successMessage = 11;
    //     }
})


router.get(/export_field_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 7;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/change_cropgroup_handler/, function (req, res) { 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.cropGroupsV5, req.query.groupref)
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)
    //go through the crops for x
    for (var crop in req.session.data.crop_types) {
        if (req.session.data.crop_types[crop].reference == req.session.data.chosen_group.crop_reference ) {
            // console.log(req.session.data.crop_types[crop].type)
            req.session.data.chosen_crop_group = req.session.data.crop_types[crop].type
        }
    }
    //if the reference == req.session.data.chosen_group.crop
    //crop type == x.type
    req.session.data.show_success_message = false    
    res.redirect('change_crop')
})

router.get(/rainfall_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true   
    req.session.data.successMessage = 12;
    req.session.data.oaktree_farm.rainfall = req.session.data.rainfall
    res.redirect('plan_view')
})

router.get(/analysis_option_handler/, function (req, res) { 
    var next = (req.session.data.soilanalysis == "yes") ? 'date' : 'previous_use'
    res.redirect(next)
})


// add to refactor
router.get(/weight_type_handler/, function (req, res) { 
    var next = 'yield_value_dry';
    if (req.session.data.yield_type == "fresh") {
        if (req.session.data.grass_management == 'grazinghay' || req.session.data.grass_management == 'grazingsilage' ) {
            next = 'fresh_yield'
        } else {
            next = 'yield_total'
        }
    }
    res.redirect(next)
})

router.get(/management_handler/, function (req, res) { 
    var next = (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") ? 'defoliation_order' : 'yield_type'
    res.redirect(next)
})

router.get(/yield_total_handler/, function (req, res) { 
    var next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
    res.redirect(next)
})


router.get(/grass_management_hander/, function (req, res) { 
    if (req.session.data.grass_management == 'grazing') {
        req.session.data.content.defoliations = 'grazings'
    } else if (req.session.data.grass_management == 'hay' || req.session.data.grass_management == 'silage') {
        req.session.data.content.defoliations = 'cuts'
    } else  {
        req.session.data.content.defoliations = 'cuts and grazings'
    }
    res.redirect('defoliation')
})



module.exports = router