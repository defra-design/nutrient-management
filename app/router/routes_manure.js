var express = require('express')
var router = express.Router()

let nextURL

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


//Routes
router.get(/v2_quantity_handler/, function (req, res) { 
    var next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'manure_incorporation_method';
    res.redirect(next);
})

router.get(/manner_quantity_handler/, function (req, res) { 
    var next = (req.session.data.quantity_type == "area" || req.session.data.quantity_type == "rate") ? 'manure_value' : 'results';
    res.redirect(next);
})

// Handlers //

router.get(/manure_fields_v5_handler/, function (req, res) {
    var new_manure_fields = []
    if (req.session.data.manure_fields == 'specific') {
        res.redirect('manure_fields_two')
    } else if (req.session.data.manure_fields == 'all') {
        for (var x in req.session.data.currentCropGroups) {
            for (var y in req.session.data.currentCropGroups[x].fields ) {
                new_manure_fields.push(req.session.data.currentCropGroups[x].fields[y].reference)
                req.session.data.manure_fields = new_manure_fields
            }
        }
        res.redirect('manure_group')
    } else {
        for (var a in req.session.data.currentCropGroups) {
            if (req.session.data.currentCropGroups[a].reference == req.session.data.manure_fields ) {
                // console.log(req.session.data.currentCropGroups[a].crop_reference)
                if (req.session.data.currentCropGroups[a].crop_reference == 'grass') {
                    req.session.data.grass_applications = true
                } else {
                    req.session.data.grass_applications = false
                }
                for (var b in req.session.data.currentCropGroups[a].fields ) {
                    new_manure_fields.push(req.session.data.currentCropGroups[a].fields[b].reference)
                    req.session.data.manure_fields = new_manure_fields;
                }
            }
        }
        res.redirect('manure_group')
    }
})

router.get(/manuretype_v7_handler/, function (req, res) {
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    res.redirect('manure_defoliation')
})

router.get(/manuretype_manner_handler/, function (req, res) {
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    console.log(req.session.data.manure_type.name)
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

router.get(/version5_manure_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 2
    var manureType = req.session.data.manure_type.name
    var manure_fields = req.session.data.manure_fields
    var manureDate = req.session.data.manure_date_day + '/' + req.session.data.manure_date_month + '/' + req.session.data.manure_date_year
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    manure_fields = null
    req.session.data.manure_fields = null
    res.redirect('/farm/crop_plan/plan_view')
})


// Routers //

router.get(/plan_manure_application_router/, function (req, res) { 
    let nextURL
    req.session.data.manure_journey = req.query.manurejourney
    if (req.session.data.manure_journey == 'multi') {
        nextURL = '/add_manure/manure_fields'
    } else {
        req.session.data.manure_fields = []
        req.session.data.manure_fields.push(req.session.data.chosen_field.reference)
        nextURL = '/add_manure/manure_group'
    }
    // console.log('nextURL = ' + nextURL)
    res.redirect(nextURL)
})

router.get(/manuregroup_handler/, callback_functions.setManureGroup, function (req, res) { 
    res.redirect("manure_type")
})

router.get(/enter_manure_defualts_handler/, function (req, res) {
    var next = (req.session.data.edit_manure_defaults === "no") ? 'manure_defaults_update' : 'manure_quantity';
    res.redirect(next);
})

router.get(/fertiliser_remove_router/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 15
    res.redirect('/farm/crop_plan/plan_view')
})

router.get(/fertiliser_change_router/, callback_functions.getApplicationByReference, function (req, res) { 
    res.redirect('update/fertiliser/update')
})  

router.get(/manuredate_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/version_2/add_manure/manure_datenotification')
})

router.get(/livestock_type_v7_handler/, function (req, res) {
    for (var x in req.session.data.manure_types_livestock) {
        if (req.session.data.manure_types_livestock[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types_livestock[x]
        }
    }
    res.redirect("manure_date")
    // res.redirect("manure_defoliation")
})

router.get(/livestock_type_export_handler/, function (req, res) {
    for (var x in req.session.data.manure_types_livestock) {
        if (req.session.data.manure_types_livestock[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types_livestock[x]
        }
    }
    res.redirect("date")
    // res.redirect("manure_defoliation")
})


router.get(/incorporation_handler/, function (req, res) {
    var next = (req.session.data.incorporation_method == "not_incorporated") ? 'rain_defaults' : 'manure_delay'
    res.redirect(next)
})


////FERTILISERS

router.get(/fertiliser_when_handler/, function (req, res) { 
    res.redirect('defoliation')
})

router.get(/v2fertiliser_handler/, function (req, res) { 
    req.session.data.fertiliser_journey = req.query.fertiliserjourney
    if (req.session.data.fertiliser_journey == 'multi') {
        res.redirect('add_fertiliser/fertiliser_fields')
    } else {
        res.redirect('add_fertiliser/fertiliser_when')
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

//FERTILISER

//view the plan by year
router.get(/crop_plan_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    res.redirect('./crop_plan/plan_view')
})

//view the selected plan
router.get(/field_level_plan_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    // console.log('req.query.chosen_field ' + req.query.chosen_field)
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field)
    // console.log(req.session.data.chosen_field)
    req.session.data.chosen_crop = req.query.chosencrop
    res.redirect('../field_plan/index')
})

router.get(/mvpfield_plan_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.chosen_field.reference)
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.cover_crop = req.query.covercrop
    res.redirect('../field_plan/index')
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
router.get(/field-select-handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_field = req.query.chosen_field
    res.redirect('/farm/field/field-details')
})

router.get(/v5_fertiliser_handler/, function (req, res) {
    var next = 'fertiliser_when'
    if (req.session.data.fertiliser_fields == 'all') {
        next = 'defoliation'
    }
    for (var group in req.session.data.currentCropGroups) {
        if (req.session.data.currentCropGroups[group].reference == req.session.data.fertiliser_fields ) {
            if (req.session.data.fertiliser_fields == 'all' || req.session.data.currentCropGroups[group].crop_reference == 'grass') {
                console.log(req.session.data.fertiliser_fields)
                console.log(req.session.data.currentCropGroups[group].crop_reference)
                next = 'defoliation'
            }
        }
    }
    var new_fertiliser_fields = []
    if (req.session.data.fertiliser_fields == 'specific') {
        next = 'fertiliser_fields_two'
    } else if (req.session.data.fertiliser_fields == 'all') {
        for (var x in req.session.data.currentCropGroups) {
            for (var y in req.session.data.currentCropGroups[x].fields ) {
                new_fertiliser_fields.push(req.session.data.currentCropGroups[x].fields[y].reference)
                req.session.data.fertiliser_fields = new_fertiliser_fields
            }
        }
    } else {
        for (var a in req.session.data.currentCropGroups) {
            if (req.session.data.currentCropGroups[a].reference == req.session.data.fertiliser_fields ) {
                for (var b in req.session.data.currentCropGroups[a].fields ) {
                    new_fertiliser_fields.push(req.session.data.currentCropGroups[a].fields[b].reference)
                    req.session.data.fertiliser_fields = new_fertiliser_fields
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
    var fertiliser_fields = req.session.data.fertiliser_fields
    var ref
    for (var x in fertiliser_fields) {
        for (var appl in req.session.data.allFertiliserApplications) {
            ref = req.session.data.allFertiliserApplications[appl].ref +1
        }
        var applicationGroup = allFunctions.addFertiliserApplication_v2 (
            req.session.data.all_fields, 
            req.session.data.currentCropGroups, 
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
    var next = '/farm/crop_plan/plan_view'
    if (req.session.data.fertiliser_journey == "multi") {
        next = '/farm/crop_plan/plan_view'
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

router.get(/change_cropgroup_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
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

router.get(/rainfall_update_handler/, callback_functions.showSuccessMessage, function (req, res) { 
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