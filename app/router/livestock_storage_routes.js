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


// Livestock routes

router.get(/livestock_report_reset/, hideSuccessMessage, function (req, res) {
    req.session.data.export_type = null
    res.redirect('livestock/livestock_years')
})

module.exports = router