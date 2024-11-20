var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

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
    res.redirect('sowdate_question')
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
            next = 'yield_value_fresh'
        }
    }
    res.redirect(next)
})

router.get(/management_handler/, function (req, res) { 
    var next = (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") ? 'defoliation_order' : 'yield_type'
    res.redirect(next)
})




module.exports = router