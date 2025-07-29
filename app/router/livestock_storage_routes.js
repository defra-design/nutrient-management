var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

// const { checkout } = require('./routes_message_reset_handlers.js');

// Storage routes

router.get(/storage_sizes_handler/, function (req, res) {
    var next = (req.session.data.material_type == 'solid manure') ? 'weight' : 'check'
    res.redirect(next)
})

router.get(/storage_type_handler/, function (req, res) {
    var next = 'size_question'
    if (req.session.data.material_type == 'solid manure') {
        next = 'storage_type_solid'
    }
    res.redirect(next)
})

router.get(/storage_size_handler/, function (req, res) {
    var next
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
    // req.session.data.successMessage = 2;
    var next = '/farm/storage/manage_storage'
    res.redirect(next)
})


// Livestock routes

router.get(/livestock_report_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.export_type = null
    res.redirect('livestock/livestock_years')
})

router.get(/manure_system_skip_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    var next = (req.session.data.manure_system_skip != 'yes') ? 'check' : './system/manure_numbers'
    res.redirect(next)
})

router.get(/farm_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.area_added = true
    res.redirect('checklist')
})

router.get(/livestockentry_handler/, function (req, res) {
    var next = (req.session.data.livestock_entry == 'monthly') ? 'livestock_numbers' : 'livestock_numbers_average'
    res.redirect(next)
})

router.get(/livestock_entry_handler/, function (req, res) {
    var next = (req.session.data.livestock_entry == 'average') ? 'values' : 'livestock_numbers'
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
    var next = 'livestock_number_question'
    // console.log('get livestock reference ' + req.session.data.livestock_reference)
    for (var reference in req.session.data.livestock_types ) {
        if (req.session.data.livestock_types[reference].reference == req.session.data.livestock_reference) {
            // console.log('found ' + req.session.data.livestock_types[reference])
            req.session.data.chosen_livestock = req.session.data.livestock_types[reference]
        }
    }
    // res.redirect("how_to_enter")
    if (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry' ) {
        req.session.data.livestock_entry = 'annually'
        next = 'livestock_numbers_average'
    }
    res.redirect(next)
})

router.get(/add_livestock_handler/, function (req, res) {
    req.session.data.livestock_reference = req.query.livestock_reference
    res.redirect('/add_livestock/livestock_type')
})

router.get(/livestock_2025_handler/, callback_functions.hide_error, function (req, res) {
    var next = 'livestock_group'
    if (req.session.data.livestock_2025 == 'no') {
        req.session.data.oaktree_farm.livestock_2025 = 'none'
        if (req.session.data.export_type == '8') {
            next = 'reset_inventory_checklist_message_handler'
        } else {
            next = 'reset_nloading_checklist_message_handler'
        }
    }
    res.redirect(next);
})


//inventory and storage routes 


router.get(/slurry_separated_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    var next = 'livestock_numbers_jan_q2'
    // if (req.session.data.manure_system == 'slurry') {
    //     next = 'add_livestock/check'
    // }
    res.redirect(next)
})

router.get(/rainwater_area_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.rainwater_area_added = true
    res.redirect('checklist')
})

router.get(/low_risk_land_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.low_risk_land_added = 'added'
    if (req.session.data.low_risk_land == 'yes') {
        next = 'area'
    } else {
        next = 'reset_inventory_checklist_message_handler'
    }
    res.redirect(next)
})

router.get(/livestock_number_handler/, function (req, res) {
    // var next = (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') ? 'values_two' : 'check'
    var next = './system/manure_system'
    // if ( (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') && (req.session.data.livestock_entry == 'monthly') ) {
    //     next = 'values_two'
    // }
    if (req.session.data.export_type == '4' ) {
        next = 'manure_system_skip'
    }
    res.redirect(next)
})

router.get(/landcheck_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.low_risk_land_added = 'added';
    res.redirect('/outputs/inventory/checklist')
})

router.get(/livestockcheck_handler/, function (req, res) { 
    if (req.session.data.livestock_number != null && req.session.data.livestock_number != '') {
        req.session.data.chosen_livestock.total = req.session.data.livestock_number
    }
    // console.log('1' + req.session.data.chosen_livestock)
    // console.log('2' + req.session.data.livestock_2025)
    req.session.data.livestock_record_2025.push(req.session.data.chosen_livestock)
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.livestock_2025 = 'added';
    req.session.data.livestock_number_january = null
    req.session.data.livestock_number_february = null
    req.session.data.livestock_number_march = null
    req.session.data.livestock_number_april = null
    req.session.data.livestock_number_may = null
    req.session.data.livestock_number_june = null
    req.session.data.livestock_number_july = null
    req.session.data.livestock_number_august = null
    req.session.data.livestock_number_september = null
    req.session.data.livestock_number_october = null
    req.session.data.livestock_number_november = null
    req.session.data.livestock_number_december = null
    req.session.data.nitrogen_standard = null
    req.session.data.livestock_occupancy = null
    res.redirect('/farm/livestock/manage_livestock')
})

router.get(/storage_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.storage_added == true ) {
        res.redirect('manage_storage')
    } else {
        res.redirect('../../add_storage/material_type')
    }
})

router.get(/livestock_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.livestock_2025 == 'added') {
        res.redirect('manage_livestock')
    } else {
        res.redirect('../../add_livestock/derogation')
    }
})

router.get(/inventory_submit_router/, function (req, res) {
    var next = 'report'
    if ((req.session.data.oaktree_farm.imports_exports == 0)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_2025 == false) {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})

router.get(/n_loading_submit_router/, function (req, res) {
    var next = 'report_no_derogation'
    if ((req.session.data.oaktree_farm.area_added == false)) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if ((req.session.data.oaktree_farm.imports_exports == 'not_answered')) {
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_2025 == 'not_answered') {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})



// imports and exports

router.get(/export_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 2;
    var next = '/farm/exports/manage_exports'
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
    req.session.data.oaktree_farm.imports_exports = 'added';
    if (req.session.data.imports_exports == 'export') {
        req.session.data.oaktree_farm.manure_exports = true;
    } else {
        req.session.data.oaktree_farm.manure_imports = true;
    }
    //reset defaults
    req.session.data.manure_type.name = null
    req.session.data.exported_day = null
    req.session.data.exported_month = null
    req.session.data.exported_year = null
    req.session.data.export_total = null
    res.redirect('/farm/exports/manage_exports')
})

router.get(/export_year_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.manure_exports == true || req.session.data.oaktree_farm.manure_imports == true ) {
        res.redirect('manage_exports')
    } else {
        res.redirect('../../add_export/export_type')
    }
})

router.get(/get_manure_type_handler/, function (req, res) {
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    res.redirect('date')
})

router.get(/export_type_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    if (req.query.export_type == 'export') {
        req.session.data.imports_exports = 'export'
    } else {
        req.session.data.imports_exports = 'import'
    }
    res.redirect('/add_export/manure_group')
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
    res.redirect('manure_type');
})

router.get(/n_loading_export_handler/, callback_functions.setManureGroup, callback_functions.hide_error, function (req, res) {
    req.session.data.manure_group_id = 'livestock'
    res.redirect('/add_export/manure_type');
})

router.get(/export_type_router/, callback_functions.hide_error, function (req, res) {
    var next = 'export_type'
    if (req.session.data.imports_exports == 'no') {
        req.session.data.oaktree_farm.imports_exports = 'none'
        if (req.session.data.export_type == '8') {
            next = '/outputs/inventory/checklist'
        } else {
            next = '/outputs/n_loading/checklist'
        }
    }
    res.redirect(next);
})

module.exports = router