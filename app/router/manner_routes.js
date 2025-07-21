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
})

router.get(/manner_change_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    res.redirect('results')
})

router.get(/manner_remove_application/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 4 //application removed
    if (req.query.application == 1) {
        req.session.data.manner_applications.shift()
    }
    if (req.query.application == 2) {
        if (req.session.data.manner_applications.length == 2) {
            req.session.data.manner_applications.pop()
        } else {
            req.session.data.manner_applications.shift()
        }
    }
    if (req.query.application == 3) {
        req.session.data.manner_applications.pop()
    }
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manuretype_update_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    req.session.data.manner_applications[1].manuretype = req.session.data.manure_type
    // console.log(req.session.data.manure_type.name)
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manner_update_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    req.session.data.manner_applications[1].rate = req.session.data.manure_rate
    // console.log(req.session.data.manner_applications)
    res.redirect('/' + req.session.data.prototype_version + '/manner/results')
})

router.get(/manner_results_handler/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 1 //done
    if (req.session.data.manure_rate == null || req.session.data.manure_rate == "" ) {
        req.session.data.manure_rate = 20
    }
    let tempApplication = {date:'01/01/2025', manuretype: req.session.data.manure_type, rate: req.session.data.manure_rate }
    req.session.data.manner_applications.push(tempApplication)
    // console.log(req.session.data.manner_applications)
    res.redirect('results')
})

router.get(/manner_values_router/, showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 2 //recalculation
    res.redirect('results#value')
})

module.exports = router