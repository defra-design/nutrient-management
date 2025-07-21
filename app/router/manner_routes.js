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


// Routes

// router.get(/manner_copy_handler/, function (req, res) {
//     let next = req.session.data.manner_applications.length == 3 ? 'manure_group' : 'copy';
//     res.redirect(next);
// });

router.get(/manner_copy_router/, showSuccessMessage, function (req, res) {
    let next = 'results'
    let tempApplication = req.session.data.manner_applications[0]
    if (req.session.data.copy_manner == 'no') {
        next = 'manure_group'
    } else {
        req.session.data.manner_applications.push(tempApplication)
    }
    console.log('check');
    res.redirect(next);
});


module.exports = router