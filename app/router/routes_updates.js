var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//Handlers

router.get(/manure_update_handler/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    console.log(req.session.data.update_type)
    var next = 'update/manure/update'
    res.redirect(next)
})

router.get(/manure_update_v6_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 13;
    var next = '../../plan_view'
    res.redirect(next)
})

router.get(/fertiliser_update_v6_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 14;
    var next = '../../plan_view'
    res.redirect(next)
})


// Routers

module.exports = router