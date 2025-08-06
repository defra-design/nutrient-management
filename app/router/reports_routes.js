var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

// const { checkout } = require('./routes_message_reset_handlers.js');



// Routes

router.get(/derogation_add_router/, function (req, res) {
    if (req.session.data.derogation == 'no') {
        req.session.data.oaktree_farm.derogation = false
    } else {
        req.session.data.oaktree_farm.derogation = true
    }
    res.redirect('livestock_group');
})

router.get(/derogation_router/, function (req, res) {
    if (req.session.data.derogation == 'no') {
        req.session.data.oaktree_farm.derogation = false
    } else {
        req.session.data.oaktree_farm.derogation = true
    }
    res.redirect('checklist');
})


router.get(/output_router/, callback_functions.hide_error, function (req, res) {   
    var next = 'export_fields'
    if (req.session.data.export_type == '1') {
        if (req.session.data.all_fields.length == 0) {
            next = 'not_available_management'
        } else {
            next = 'export_fields'
        }
    }
    // NMAX
    if (req.session.data.export_type == '3') {
        if (req.session.data.all_fields.length == 0 || req.session.data.currentCropGroups.length == 0) {
            next = 'not_available_max'
        } else {
            next = 'export_crops'
        }
    }
    // N-LOADING
    if (req.session.data.export_type == '4' ) {
        if (req.session.data.oaktree_farm.derogation == null) {
            next = './n_loading/derogation'
        } else {
            next = './n_loading/checklist'
        }
    }
    if (req.session.data.export_type == '5') {
        next = 'not_available_livestock'
    }
    if (req.session.data.export_type == '6') {
        next = 'not_available_imports'
    }
    // EXISTING MANURE STORAGE
    if (req.session.data.export_type == '7') {
        if (req.session.data.oaktree_farm.storage_added != true) {
            next = 'not_available_storage'
        } else {
            next = '../storage/report'
            // next = '../storage/manage_storage'

        }
    }
    // MANURE INVENTORY AND STORAGE
    if (req.session.data.export_type == '8') {
        next = './inventory/checklist'
    }
    res.redirect(next)
})

module.exports = router