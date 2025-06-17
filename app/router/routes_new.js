var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
const { checkout } = require('./routes_message_reset_handlers.js');

const hide_error = function (req, res, next) {
    req.session.data.show_error = false
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

//export the documents
router.get(/output_router/, hide_error, function (req, res) {     
    var next = 'export_fields'
    if (req.session.data.export_type == 1) {
        if (req.session.data.all_fields.length == 0) {
            next = 'not_available_management'
        } else {
            next = 'export_fields'
        }
    }
    // NMAX
    if (req.session.data.export_type == 3) {
        if (req.session.data.all_fields.length == 0 || req.session.data.currentCropGroups.length == 0) {
            next = 'not_available_max'
        } else {
            next = 'export_crops'
        }
    }
    // N LOADING
    if (req.session.data.export_type == 4 ) {
        if (req.session.data.oaktree_farm.derogation == null) {
            next = './n_loading/derogation'
        } else {
            next = './n_loading/checklist'
        }
    }
    if (req.session.data.export_type == 5) {
        next = 'not_available_livestock'
    }
    if (req.session.data.export_type == 6) {
        next = 'not_available_imports'
    }
    // EXISTING MANURE STORAGE
    if (req.session.data.export_type == 7) {
        if (req.session.data.storage_added == false) {
            next = 'not_available_storage'
        } else {
            next = 'not_available_storage'
        }
    }
    // MANURE INVENTORY AND STORAGE
    if (req.session.data.export_type == 8) {
        next = './inventory/derogation'
    }
    res.redirect(next)
})

//set the farm derogation
router.get(/derogation_router/, function (req, res) {
    if (req.session.data.derogation == 'no') {
        req.session.data.oaktree_farm.derogation = false
    } else {
        req.session.data.oaktree_farm.derogation = true
    }
    res.redirect('checklist');
})

router.get(/derogation_add_router/, function (req, res) {
    if (req.session.data.derogation == 'no') {
        req.session.data.oaktree_farm.derogation = false
    } else {
        req.session.data.oaktree_farm.derogation = true
    }
    res.redirect('livestock_group');
})

router.get(/export_type_router/, hide_error, function (req, res) {
    var next = 'manure_group'
    if (req.session.data.imports_exports == 'none') {
        req.session.data.oaktree_farm.imports_exports = 'none'
        if (req.session.data.export_type == 8) {
            next = 'reset_inventory_checklist_message_handler'
        } else {
            next = 'reset_nloading_checklist_message_handler'
        }
    }
    res.redirect(next);
})

router.get(/change_export_handler/, hide_error, function (req, res) {
    if (req.query.export_type == 'export') {
        req.session.data.imports_exports = 'export'
    } else {
        req.session.data.imports_exports = 'import'
    }
    res.redirect('/version_7/update/exports/update')
})

router.get(/export_type_handler/, hideSuccessMessage, function (req, res) { 
    if (req.query.export_type == 'export') {
        req.session.data.imports_exports = 'export'
    } else {
        req.session.data.imports_exports = 'import'
    }
    res.redirect('/version_7/add_export/manure_group')
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

router.get(/n_loading_submit_router/, function (req, res) {
    var next = 'report_no_derogation'
    if ((req.session.data.oaktree_farm.imports_exports == 0)) { //no_anser
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_added == false) {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})

router.get(/inventory_submit_router/, function (req, res) {
    var next = 'report'
    if ((req.session.data.oaktree_farm.imports_exports == 0)) { //no_anser
        next = 'checklist';
        req.session.data.show_error = true;
    }
    if (req.session.data.oaktree_farm.livestock_added == false) {
        next = 'checklist'
        req.session.data.show_error = true
    }
    res.redirect(next)
})

router.get(/livestock_year_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.livestock_added == true) {
        res.redirect('manage_livestock')
    } else {
        res.redirect('../../add_livestock/derogation')
    }
})

router.get(/export_year_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.manure_exports == true || req.session.data.oaktree_farm.manure_imports == true ) {
        res.redirect('manage_exports')
    } else {
        res.redirect('../../add_export/export_type')
    }
})

router.get(/storage_year_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.query.harvest_date
    if (req.session.data.oaktree_farm.storage == true ) {
        res.redirect('manage_storage')
    } else {
        res.redirect('../../add_storage/material_type')
    }
})

//refactored - update
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
    res.redirect('/'+ req.session.data.prototype_version + '/farm/exports/manage_exports')
})

//refactored - update
router.get(/output_year_handler/, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.session.data.output_year
    res.redirect('export')
})

router.get(/livestockcheck_handler/, function (req, res) { 
    if (req.session.data.livestock_number != null && req.session.data.livestock_number != '') {
        req.session.data.chosen_livestock.total = req.session.data.livestock_number
    }
    req.session.data.livestock_2025.push(req.session.data.chosen_livestock)
    console.log(req.session.data.chosen_livestock)
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.livestock_added = true;
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
    res.redirect('/'+ req.session.data.prototype_version + '/farm/livestock/manage_livestock')
})

router.get(/get_livestock_reference/, function (req, res) {
    // console.log('get livestock reference ' + req.session.data.livestock_reference)
    for (var reference in req.session.data.livestock_types ) {
        if (req.session.data.livestock_types[reference].reference == req.session.data.livestock_reference) {
            // console.log('found ' + req.session.data.livestock_types[reference])
            req.session.data.chosen_livestock = req.session.data.livestock_types[reference]
        }
    }
    // res.redirect("how_to_enter")
    res.redirect("livestock_number_question")
})

router.get(/add_livestock_handler/, function (req, res) {
    req.session.data.livestock_reference = req.query.livestock_reference
    res.redirect('/version_7/add_livestock/livestock_type')
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

router.get(/manner_values_router/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 2 //recalculation
    res.redirect('results#value')
})

router.get(/manner_results_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 1 //done
    if (req.session.data.manure_rate == null || req.session.data.manure_rate == "" ) {
        req.session.data.manure_rate = 20
    }
    let tempApplication = {date:'01/01/2025', manuretype: req.session.data.manure_type, rate: req.session.data.manure_rate }
    req.session.data.manner_applications.push(tempApplication)
    // console.log(req.session.data.manner_applications)
    res.redirect('results')
})

router.get(/manner_update_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    req.session.data.manner_applications[1].rate = req.session.data.manure_rate
    // console.log(req.session.data.manner_applications)
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manuretype_update_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    req.session.data.manner_applications[1].manuretype = req.session.data.manure_type
    // console.log(req.session.data.manure_type.name)
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})


router.get(/manner_remove_application/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 4 //application removed
    if (req.query.application == 1) {
        req.session.data.manner_applications.shift()
    }
    if (req.query.application == 2) {
        if (req.session.data.manner_applications.length == 2) {
            req.session.data.manner_applications.pop()
        } else {
            req.session.data.manner_applications.shift()
        }
    }
    if (req.query.application == 3) {
        req.session.data.manner_applications.pop()
    }
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manner_change_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    res.redirect('results')
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

router.get(/export_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 2;
    var next = '/' + req.session.data.prototype_version + '/farm/exports/manage_exports'
    res.redirect(next)
})

router.get(/livestock_entry_handler/, function (req, res) {
    var next = (req.session.data.livestock_entry == 'average') ? 'values' : 'livestock_numbers'
    //blocked for now
    res.redirect('values')
})

router.get(/grass_years_handler/, function (req, res) {
    let next = 'previous_lay'
    for (var item in req.session.data.grass_years) {
        if (req.session.data.grass_years[item] == '2024') {
            next = 'previous_cuts'
        }
    }
    res.redirect(next)
})

// router.get(/manner_copy_handler/, function (req, res) {
//     let next = req.session.data.manner_applications.length == 3 ? 'manure_group' : 'copy';
//     res.redirect(next);
// });

router.get(/manner_copy_router/, function (req, res) {
    let next
    let tempApplication = req.session.data.manner_applications[0]
    if (req.session.data.copy_manner == 'no') {
        next = 'manure_group'
    } else {
        req.session.data.manner_applications.push(tempApplication)
        next = 'results'
    }
    res.redirect(next);
});

router.get(/check_storage_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.storage_added = true;
    // req.session.data.successMessage = 2;
    var next = '/' + req.session.data.prototype_version + '/farm/storage/manage_storage'
    res.redirect(next)
})

router.get(/storage_size_handler/, function (req, res) {
    var next = (req.session.data.storage_question == 'dimensions') ? 'sizes' : 'check'
    res.redirect(next)
})

router.get(/livestockentry_handler/, function (req, res) {
    var next = (req.session.data.livestock_entry == 'monthly') ? 'livestock_numbers' : 'livestock_numbers_average'
    res.redirect(next)
})

router.get(/livestock_number_handler/, function (req, res) {
    // var next = (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') ? 'values_two' : 'check'
    var next = 'check'
    if ( (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') && (req.session.data.livestock_entry == 'monthly') ) {
        next = 'values_two'
    }
    res.redirect(next)
})

router.get(/farm_area_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.area_added = true
    res.redirect('checklist')
})

router.get(/low_risk_land_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.low_risk_land_added = true
    if (req.session.data.low_risk_land == 'yes') {
        next = 'area'
    } else {
        next = 'reset_inventory_checklist_message_handler'
    }
    res.redirect(next)
})

router.get(/rainwater_area_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.rainwater_area_added = true
    res.redirect('checklist')
})

module.exports = router