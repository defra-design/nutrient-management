var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//export the documents
router.get(/output_router/, function (req, res) { 
    // if (req.session.data.export_type == 1) {
    //     next = 'export_fields'
    // } else if (req.session.data.export_type == 2) {
    //     next = './outputs/workbook'
    // } else {
    //     next = './outputs/nmax_report_v2'
    // }
    var next = 'export_fields'
    if (req.session.data.export_type == 3) {
        next = 'export_crops'
    } else if (req.session.data.export_type == 4) {
        if (req.session.data.oaktree_farm.derogation == null) {
            next = './n_loading/derogation'
        } else {
            next = './n_loading/checklist'
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
    res.redirect('checklist');
})

router.get(/export_type_router/, function (req, res) {
    var next = 'manure_group'
    if (req.session.data.import_export == 'none') {
        req.session.data.oaktree_farm.exports_added = true
        next = '/' + req.session.data.prototype_version + '/farm/outputs/n_loading/checklist'
    }
    res.redirect(next);
})


//not new dont refactor
router.get(/get_manure_type_handler/, function (req, res) {
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    res.redirect('date')
})


module.exports = router