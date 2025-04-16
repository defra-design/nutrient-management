var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

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
    console.log(req.session.data.all_fields.length)
    console.log(req.session.data.export_type)
    if (req.session.data.export_type == 1) {
        if (req.session.data.all_fields.length === 0) {
            next = 'not_available_management'
        } else {
            next = 'export_fields'
        }
    }
    if (req.session.data.export_type == 3) {
        if (req.session.data.all_fields.length === 0) {
            next = 'not_available_max'
        } else {
            next = 'export_crops'
        }
    }
    if (req.session.data.export_type == 4) {
        if (req.session.data.oaktree_farm.livestock_added == true) {
            next = './n_loading'
        } else {
            next = 'not_available_loading'
        }
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
    res.redirect('livestock_group');
})

router.get(/export_type_router/, hide_error, function (req, res) {
    var next = 'manure_group'
    if (req.session.data.import_export == 'none') {
        req.session.data.oaktree_farm.exports_added = true
        next = '/' + req.session.data.prototype_version + '/farm/outputs/n_loading/checklist'
    }
    res.redirect(next);
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
    var next = 'index'
    if (req.session.data.oaktree_farm.livestock_added == false || req.session.data.oaktree_farm.exports_added == false) {
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
    if (req.session.data.oaktree_farm.exports_added == true) {
        res.redirect('manage_exports')
    } else {
        res.redirect('../../add_export/export_type')
    }
})

//refactored - update
router.get(/exportcheck_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    if (req.session.data.import_export == 'export') {
        req.session.data.oaktree_farm.exports_added = true;
    } else {
        req.session.data.oaktree_farm.imports_added = true;
    }
    res.redirect('/'+ req.session.data.prototype_version + '/farm/exports/manage_exports')
})

//refactored - update
router.get(/output_year_handler/, function (req, res) { 
    req.session.data.oaktree_farm.planning_year = req.session.data.output_year
    res.redirect('export')
})

router.get(/livestockcheck_handler/, function (req, res) { 
    req.session.data.livestock_2025.push(req.session.data.chosen_livestock)
    console.log(req.session.data.livestock_2025)
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.livestock_added = true;
    req.session.data.livestock_number = null
    req.session.data.nitrogen_standard = null
    req.session.data.livestock_occupancy = null
    res.redirect('/'+ req.session.data.prototype_version + '/farm/livestock/manage_livestock')
})

router.get(/get_livestock_reference/, function (req, res) {
    console.log('get livestock reference ' + req.session.data.livestock_reference)
    for (var reference in req.session.data.livestock_types ) {
        if (req.session.data.livestock_types[reference].reference == req.session.data.livestock_reference) {
            console.log('found ' + req.session.data.livestock_types[reference])
            req.session.data.chosen_livestock = req.session.data.livestock_types[reference]
        }
    }
    var next = 'values'
    res.redirect(next)
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

router.get(/manner_reset_handler/, function (req, res) {
    res.redirect('fields')
})

router.get(/manner_results_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 1 //done
    res.redirect('results')
})

router.get(/manner_change_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //chnaged
    res.redirect('results')
})


module.exports = router