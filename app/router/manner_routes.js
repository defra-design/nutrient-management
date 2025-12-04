var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

// const { checkout } = require('./routes_message_reset_handlers.js');

// Routes

// router.get(/manner_copy_handler/, function (req, res) {
//     let next = req.session.data.manner_applications.length == 3 ? 'manure_group' : 'copy';
//     res.redirect(next);
// });

router.get(/manner_setup_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let next = 'name'
    if (req.session.data.oaktree_farm.setup == true) {
        next = 'existing'
    }
    res.redirect(next)
})

router.get(/set_mannerfield_name_handler/, function (req, res) { 
    req.session.data.temp_field.field_id = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") req.session.data.temp_field_name = 'New Field #' + req.session.data.temp_field.field_id;
    req.session.data.temp_field.field_name = req.session.data.temp_field_name;
    res.redirect('nvz');
})

router.get(/use_existing_farm_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let next = 'farm'
    if (req.session.data.use_existing_farm == 'no') {
        next = 'name'
    }
    res.redirect(next)
})

router.get(/manner_copy_router/, callback_functions.showSuccessMessage, function (req, res) {
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

router.get(/manner_change_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    res.redirect('results')
})

router.get(/manner_remove_application/, callback_functions.showSuccessMessage, function (req, res) {
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
    res.redirect('manner/results')
})

router.get(/manuretype_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    //get object
    for (var x in req.session.data.manure_types ) {
        if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types[x]
        }
    }
    req.session.data.manner_applications[1].manuretype = req.session.data.manure_type
    // console.log(req.session.data.manure_type.name)
    res.redirect('manner/results')
})

router.get(/manner_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    req.session.data.manner_applications[1].rate = req.session.data.manure_rate
    // console.log(req.session.data.manner_applications)
    res.redirect('manner/results')
})

router.get(/manner_results_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 1 //done
    if (req.session.data.manure_rate == null || req.session.data.manure_rate == "" ) {
        req.session.data.manure_rate = 20
    }
    let tempApplication = {date:'01/01/2026', manuretype: req.session.data.manure_type, rate: req.session.data.manure_rate }
    req.session.data.manner_applications.push(tempApplication)
    console.log("here " + req.session.data.manner_applications.length)
    res.redirect('results')
})

router.get(/manner_values_router/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 2 //recalculation
    res.redirect('results#value')
})

router.get(/copy_estimate_handler/, callback_functions.showSuccessMessage, function (req, res) {
    res.redirect('estimates_list')
})


module.exports = router