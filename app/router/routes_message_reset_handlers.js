var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}

const hide_error = function (req, res, next) {
    req.session.data.show_error = false
    next()
}

// Reset handlers for messages

router.get(/manner_results_reset/, hideSuccessMessage, function (req, res) {
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manner_manure_group_reset/, hideSuccessMessage, function (req, res) {
    res.redirect('/' + req.session.data.prototype_version + '/manner/manure_group')
})

router.get(/manner_fields_reset/, hideSuccessMessage, function (req, res) {
    res.redirect('fields')
})

router.get(/reset_manage_livestock_message_handler/, hideSuccessMessage, function (req, res) { 
    res.redirect('/' + req.session.data.prototype_version + '/farm/livestock/manage_livestock')
})

// MANAGE EXPORTS
router.get(/reset_manage_exports_message_handler/, hideSuccessMessage, function (req, res) { 
    res.redirect('/' + req.session.data.prototype_version + '/farm/exports/manage_exports')
})

// N-LOADING CHECKLIST
router.get(/reset_nloading_checklist_message_handler/, hide_error, function (req, res) { 
    res.redirect('/' + req.session.data.prototype_version + '/farm/outputs/n_loading/checklist')
})

module.exports = router