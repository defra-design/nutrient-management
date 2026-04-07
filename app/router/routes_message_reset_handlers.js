var express = require('express')
var router = express.Router()

var callback_functions = require('./callbacks.js');


// =============================================================================
// MESSAGE RESET HANDLERS
// These routes don't do any real work — they just clear success banners or
// error messages before redirecting the user back to a page. This prevents
// a success banner from persisting if the user navigates back to a page.
// =============================================================================


// -------------------------
// MANNER
// -------------------------

// clears success message before returning to manner results
router.get(/manner_results_reset/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/manner/results')
})

// clears success message before returning to manner manure group
router.get(/manner_manure_group_reset/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('manner/manure_group')
})

// clears success message before returning to manner fields
router.get(/manner_fields_reset/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('fields')
})


// -------------------------
// FARM HUB
// -------------------------

// clears success message before returning to the farm hub
router.get(/hub_message_reset/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/hub')
})

// clears success message and resets farm name before returning to farms list
router.get(/farmsview_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    req.session.data.farm.name = "Oaktree Lane Farm"
    res.redirect('/management/farm/farms');
})


// -------------------------
// FIELDS
// -------------------------

// clears success message before returning to manage-fields
router.get(/field_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/field/manage-fields');
})

// clears success message before returning to add-field/name
router.get(/field_add_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/planning/add-field/name');
})

// clears success message before returning to copy field screen
router.get(/field_copy_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/planning/add-field/copy_field');
})

// clears success message before returning to field details
router.get(/field_details_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/field/field-details');
})


// -------------------------
// PLAN VIEW
// -------------------------

// clears success message before returning to plan view (two routes do the same thing)
router.get(/planview_reset_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/crop_plan/plan_view');
})

router.get(/plan_view_reset_router/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/crop_plan/plan_view');
})


// -------------------------
// EXPORTS
// -------------------------

// clears success message before returning to manage exports
router.get(/reset_manage_exports_message_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/exports/manage_exports')
})


// -------------------------
// STORAGE
// -------------------------

// clears error and success messages before returning to manage storage
router.get(/reset_manage_storage_message_handler/, callback_functions.hide_error, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/storage/manage_storage')
})


// -------------------------
// LOW RUN-OFF RISK LAND
// -------------------------

// clears success message before returning to manage land
router.get(/reset_manage_land_message_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/management/farm/land/manage_land')
})


// -------------------------
// LIVESTOCK (N-LOADING)
// -------------------------

// clears success message before returning to n-loading manage livestock
router.get(/reset_manage_livestock_message_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/reports/n_loading/manage_livestock/index')
})

// clears success message and sets journey to 'add' before starting n-loading livestock add
router.get(/reset_add_loading_lstock/, callback_functions.hidesuccess_message, function (req, res) {
    req.session.data.livestock_update_journey = false;
    res.redirect('/reports/add_livestock/livestock_group');
})


// -------------------------
// LIVESTOCK (MANURE INVENTORY)
// -------------------------

// clears success message and sets journey to 'add' before starting inventory livestock add
router.get(/reset_add_inventory_lstock/, callback_functions.hidesuccess_message, function (req, res) {
    req.session.data.livestock_update_journey = false;
    res.redirect('/reports/manure_inventory/livestock_group');
})

// clears success message before returning to inventory manage livestock numbers
router.get(/reset_numbers_livestock_inventory_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/reports/manure_inventory/manage_livestock/numbers')
})

// clears success message before returning to inventory manage livestock index
router.get(/reset_manage_livestock_inventory_handler/, callback_functions.hidesuccess_message, function (req, res) {
    res.redirect('/reports/manure_inventory/manage_livestock/index')
})


// -------------------------
// CHECKLISTS
// -------------------------

// clears error before returning to n-loading checklist
router.get(/reset_nloading_checklist_message_handler/, callback_functions.hide_error, function (req, res) {
    res.redirect('/reports/n_loading/checklist')
})

// clears error before returning to manure inventory checklist
router.get(/reset_inventory_checklist_message_handler/, callback_functions.hide_error, function (req, res) {
    res.redirect('/reports/storage_requirement_mvp/checklist')
})


module.exports = router
