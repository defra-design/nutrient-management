var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// Reset handlers for messages

router.get(/manner_results_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('manner/results')
})

router.get(/manner_manure_group_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('manner/manure_group')
})

router.get(/manner_fields_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('fields')
})

router.get(/reset_manage_livestock_message_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/livestock/manage_livestock')
})

// MANAGE EXPORTS
router.get(/reset_manage_exports_message_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/exports/manage_exports')
})

// N-LOADING CHECKLIST
router.get(/reset_nloading_checklist_message_handler/, callback_functions.hide_error, function (req, res) { 
    res.redirect('/outputs/n_loading/checklist')
})

// MANAGE STORAGE
router.get(/reset_manage_storage_message_handler/, callback_functions.hide_error, function (req, res) { 
    res.redirect('/farm/storage/manage_storage')
})

// INVENTORY CHECKLIST
router.get(/reset_inventory_checklist_message_handler/, callback_functions.hide_error, function (req, res) { 
    res.redirect('/outputs/inventory/checklist')
})

// MANAGE LOW RUN-OFF RISK LAND 
router.get(/reset_manage_land_message_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/land/manage_land')
})

// MANAGE LIVESTOCK NUMBERS - INVENTORY
router.get(/reset_manage_livestock_inventory_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/outputs/inventory/manage_livestock/numbers')
})

module.exports = router