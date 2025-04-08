var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

const hide_error = function (req, res, next) {
    req.session.data.show_error = false
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}

//export the documents
router.get(/output_router/, hide_error, function (req, res) {     
    var next = 'export_fields'
    if (req.session.data.export_type == 3) {
        next = 'export_crops'
    } else if (req.session.data.export_type == 4) {
        next = './n_loading/checklist'
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
        res.redirect('../../add_livestock/livestock_group')
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
    res.redirect('/'+ req.session.data.prototype_version + '/farm/livestock/manage_livestock')
})

module.exports = router