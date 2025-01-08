var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

router.get(/rainfall_update_v6_handler/, function (req, res) { 
    req.session.data.show_success_message = true   
    req.session.data.successMessage = 12;
    req.session.data.oaktree_farm.rainfall = req.session.data.rainfall
    res.redirect('../plan_view')
})

module.exports = router