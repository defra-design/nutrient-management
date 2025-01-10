var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//Handlers

router.get(/manure_update_handler/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    console.log(req.session.data.update_type)
    var next = 'update/manure/fields'
    res.redirect(next)
})

// Routers

module.exports = router