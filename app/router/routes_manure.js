var express = require('express')
var router = express.Router()

let nextURL

var allFunctions = require('../functions/allFunctions.js');

//cb functions
const getApplicationByReference = function (req, res, next) {
    req.session.data.application_ref = req.query.applicationref
    // console.log('Application Ref = ' + req.session.data.application_ref)
    next()
}

const setManureJourney = function (req, res, next) {
    req.session.data.manure_journey = req.query.manurejourney
    // console.log('manure journey = ' + req.session.data.manure_journey)
    if (req.session.data.manure_journey == 'multi') {
        nextURL = '/' + req.session.data.prototype_version + '/add_manure/manure_fields'
    } else {
        req.session.data.manure_fields = []
        req.session.data.manure_fields.push(req.session.data.chosen_field.reference)
        nextURL = '/' + req.session.data.prototype_version + '/add_manure/manure_group'
    }
    next()
}

const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}


const setManureGroup = function (req, res, next) {
    if (req.session.data.manure_group_id == "livestock") {
        req.session.data.manure_types = req.session.data.manure_types_livestock
    } else if (req.session.data.manure_group_id == "biosolids") {
        req.session.data.manure_types = req.session.data.manure_types_biosolid
    } else if (req.session.data.manure_group_id == "other") {
        req.session.data.manure_types = req.session.data.manure_types_other
    } else if (req.session.data.manure_group_id == "digestate") {
        req.session.data.manure_types = req.session.data.manure_types_digestate
    }
    // console.log('manure types = ' + req.session.data.manure_types)
    next()
}

//routers
router.get(/plan_manure_application_handler/, setManureJourney, function (req, res) { 
    res.redirect(nextURL)
})

router.get(/fertiliser_change_router/, getApplicationByReference, function (req, res) { 
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/update/fertiliser/update')
})  

router.get(/version5_manure_update_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 4
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
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

router.get(/manuregroup_handler/, setManureGroup, function (req, res) { 
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
    var next = "manure_defoliation"
    if (req.session.data.manure_group_id == "livestock") {
        next = "livestock_type"
        if (req.session.data.manure_type == "dirty_water" ||
            req.session.data.manure_type == "horse_fym" || 
            req.session.data.manure_type == "goat_fym" ||
            req.session.data.manure_type == "poultry") {
            next = "manure_defoliation"
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
    res.redirect("manure_defoliation")
})

router.get(/incorporation_handler/, function (req, res) {
    if (req.session.data.incorporation_method == 'not_incorporated') {
        res.redirect("rain_defaults")
    } else {
        res.redirect("manure_delay")
    }
})

router.get(/enter_manure_defualts_handler/, function (req, res) {
    var next = (req.session.data.edit_manure_defaults === "no") ? 'manure_defaults_update' : 'manure_quantity';
    res.redirect(next);
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




router.get(/fertiliser_when_handler/, function (req, res) { 
    res.redirect('defoliation')
})

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
router.get(/version2_fertiliser_handler/, showSuccessMessage, function (req, res) { 
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

router.get(/fertiliser_v5_update_handler/, showSuccessMessage, function (req, res) { 
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


router.get(/v2_quantity_handler/, function (req, res) { 
    var next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'manure_incorporation_method';
    res.redirect(next);
})

//add another
router.get(/v2_another_crop_router/, function (req, res) { 
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


//view the plan by year
router.get(/crop_plan_year_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    res.redirect('./crop_plan/plan_view')
})

//view the selected plan
router.get(/field_level_plan_handler/, hideSuccessMessage, function (req, res) { 
    // console.log('req.query.chosen_field ' + req.query.chosen_field)
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field)
    // console.log(req.session.data.chosen_field)
    req.session.data.chosen_crop = req.query.chosencrop
    res.redirect('../field_plan/index')
})

router.get(/field_level_plan_v5_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = req.query.fieldref
    req.session.data.chosen_field = req.query.groupref
    // console.log(req.session.data.chosen_group)
    // console.log(req.session.data.chosen_field)
    //group.reference 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.allCropGroups, req.query.groupref)
    //field reference
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)    
    res.redirect('../field_plan/index')
})

///2025
router.get(/field_level_plan_v6_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = req.query.groupref 
    req.session.data.chosen_field = req.query.fieldref
    // console.log(req.session.data.chosen_group)
    // console.log(req.session.data.chosen_field)
    //group.reference 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.chosen_farm_crop_groups, req.query.groupref)
    //field reference
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.chosen_farm_fields, req.query.fieldref)    
    res.redirect('../field_plan/index')
})

router.get(/group_level_plan_v6_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = req.query.groupref
    console.log(req.session.data.chosen_group)
    //group.reference
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.chosen_farm_crop_groups, req.query.groupref)
    res.redirect('/update/crop/change_crop')
})

router.get(/mvpfield_plan_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field.reference)
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.cover_crop = req.query.covercrop
    res.redirect('../field_plan/index')
})

//add manure
router.get(/v2_manure_check_handler/, hideSuccessMessage, function (req, res) { 
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
router.get(/field-select-handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_field = req.query.chosen_field
    res.redirect('/'+ req.session.data.prototype_version + '/farm/field/field-details')
})

//update soil
router.get(/add_soil_handler/, showSuccessMessage, function (req, res) { 
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

router.get(/condition_question_handler/, function (req, res) { 
    req.session.data.condition_question = req.query.question
    res.redirect('condition_question')
})



router.get(/v5_fertiliser_handler/, function (req, res) {
    var next = 'fertiliser_when'
    if (req.session.data.fertiliser_fields == 'all') {
        next = 'defoliation'
    }
    for (var group in req.session.data.allCropGroups) {
        if (req.session.data.allCropGroups[group].reference == req.session.data.fertiliser_fields ) {
            if (req.session.data.fertiliser_fields == 'all' || req.session.data.allCropGroups[group].crop_reference == 'grass') {
                console.log(req.session.data.fertiliser_fields)
                console.log(req.session.data.allCropGroups[group].crop_reference)
                next = 'defoliation'
            }
        }
    }
    var new_fertiliser_fields = []
    if (req.session.data.fertiliser_fields == 'specific') {
        next = 'fertiliser_fields_two'
    } else if (req.session.data.fertiliser_fields == 'all') {
        for (var x in req.session.data.allCropGroups) {
            for (var y in req.session.data.allCropGroups[x].fields ) {
                new_fertiliser_fields.push(req.session.data.allCropGroups[x].fields[y].reference)
                req.session.data.fertiliser_fields = new_fertiliser_fields
            }
        }
    } else {
        for (var a in req.session.data.allCropGroups) {
            if (req.session.data.allCropGroups[a].reference == req.session.data.fertiliser_fields ) {
                for (var b in req.session.data.allCropGroups[a].fields ) {
                    new_fertiliser_fields.push(req.session.data.allCropGroups[a].fields[b].reference)
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
        for (var x in req.session.data.allCropGroups) {
            for (var y in req.session.data.allCropGroups[x].fields ) {
                new_manure_fields.push(req.session.data.allCropGroups[x].fields[y].reference)
                req.session.data.manure_fields = new_manure_fields
            }
        }
        res.redirect('manure_group')
    } else {
        for (var a in req.session.data.allCropGroups) {
            if (req.session.data.allCropGroups[a].reference == req.session.data.manure_fields ) {
                // console.log(req.session.data.allCropGroups[a].crop_reference)
                if (req.session.data.allCropGroups[a].crop_reference == 'grass') {
                    req.session.data.grass_applications = true
                } else {
                    req.session.data.grass_applications = false
                }
                for (var b in req.session.data.allCropGroups[a].fields ) {
                    new_manure_fields.push(req.session.data.allCropGroups[a].fields[b].reference)
                    req.session.data.manure_fields = new_manure_fields;
                }
            }
        }
        res.redirect('manure_group')
    }
})

router.get(/version5_manure_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 2
    var manureType = req.session.data.manure_type.name
    var manure_fields = req.session.data.manure_fields
    var manureDate = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.allCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    manure_fields = null
    req.session.data.manure_fields = null
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})


//set fertiliser
router.get(/fertiliser_v5_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 3
    var fertiliserDate = req.session.data.fertiliser_date_day + '/' + req.session.data.fertiliser_date_month + '/' + req.session.data.fertiliser_date_year
    var fertiliser_fields = req.session.data.fertiliser_fields
    var ref
    for (var x in fertiliser_fields) {
        for (var appl in req.session.data.allFertiliserApplications) {
            ref = req.session.data.allFertiliserApplications[appl].ref +1
        }
        var applicationGroup = allFunctions.addFertiliserApplication_v2 (
            req.session.data.all_fields, 
            req.session.data.allCropGroups, 
            fertiliser_fields[x], 
            fertiliserDate, 
            req.session.data.nitrogen, 
            req.session.data.phosphate, 
            req.session.data.potash, 
            req.session.data.sulphur, 
            req.session.data.lime,
            ref
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

router.get(/manure_defoliation_handler/, function (req, res) {
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

router.get(/change_cropgroup_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.allCropGroups, req.query.groupref)
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
    res.redirect('change_crop')
})

///2025
router.get(/change_cropgroup_v6_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.chosen_farm_crop_groups, req.query.groupref)
    // console.log(req.session.data.chosen_group)
    res.redirect('change_crop')
})

router.get(/rainfall_update_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 12;
    req.session.data.oaktree_farm.ewr = req.session.data.excess_rain
    res.redirect('../../plan_view')
})

router.get(/update_variety/, function (req, res) {
    // req.session.data.chosen_crop_group.variety = req.session.data.new_variety
    // req.session.data.show_success_message = true  
    res.redirect('../change_crop')
})

module.exports = router