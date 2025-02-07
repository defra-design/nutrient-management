var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//call back functions
const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}



module.exports = router