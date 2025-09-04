var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


// Reset handlers for messages

router.get(/manner_results_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('manner/results')
})

router.get(/hub_message_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('/farm/hub')
})

router.get(/manner_manure_group_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('manner/manure_group')
})

router.get(/manner_fields_reset/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('fields')
})

router.get(/reset_manage_livestock_message_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/outputs/n_loading/manage_livestock/index')
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
router.get(/reset_manage_storage_message_handler/, callback_functions.hide_error, callback_functions.hideSuccessMessage, function (req, res) { 
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
router.get(/reset_numbers_livestock_inventory_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/outputs/inventory/manage_livestock/numbers')
})

// MANAGE LIVESTOCK MANAGE - INVENTORY
router.get(/reset_manage_livestock_inventory_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/outputs/inventory/manage_livestock/index')
})

//manage fields view reset messages
router.get(/field_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) {
    res.redirect('/farm/field/manage-fields');
})

//add a field view reset messages
router.get(/field_add_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/add-field/name');
})

//add a field view reset messages
router.get(/field_copy_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('add-field/copy_field');
})

//field details view reset messages
router.get(/field_details_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/field/field-details');
})

//plan_view reset messages
router.get(/planview_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('../crop_plan/plan_view');
})

//change the livestock add / change journey to add for inventory livestock
router.get(/reset_add_inventory_lstock/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.livestock_update_journey = false;
    res.redirect('/add_livestock_inventory/livestock_group');
})

//change the livestock add / change journey to add for n_loading livestock
router.get(/reset_add_loading_lstock/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.livestock_update_journey = false;
    res.redirect('/add_livestock/livestock_group');
})

//Reset the manure collection success message
router.get(/reset_manure_collection_message/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/outputs/inventory/manage_collection/index');
})

router.get(/plan_view_reset_router/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/crop_plan/plan_view');
})

//farms reset messages
router.get(/farmsview_reset_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    res.redirect('/farm/farms');
})

module.exports = router