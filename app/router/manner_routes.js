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
  let next = (req.session.data.oaktree_farm.setup == true) ? 'existing' : 'name'
  res.redirect(next)
})

router.get(/set_mannerfield_name_handler/, function (req, res) { 
    req.session.data.temp_field = allFunctions.setFieldName(req.session.data.temp_field, req.session.data.temp_field_name, req.session.data.all_fields.length);
    res.redirect('nvz');
})

router.get(/use_existing_farm_handler/, callback_functions.showSuccessMessage, function (req, res) {
  let next = (req.session.data.use_existing_farm == 'no') ? 'name' : 'farm'
  res.redirect(next)
})

router.get(/manner_copy_router/, callback_functions.showSuccessMessage, function (req, res) {
    let next = 'manure_group'
    if (req.session.data.copy_manner != 'no') {
        req.session.data.manner_applications.push({ref: req.session.data.manner_applications.length + 1, date:'01/06/2026', manuretype: req.session.data.manner_applications[0].manuretype, rate: 30 })
        next = 'results'
    }
    res.redirect(next);
})

router.get(/manner_change_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    res.redirect('results')
})

router.get(/manuretype_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    req.session.data.manner_applications[0].manuretype = allFunctions.getByName(req.session.data.manure_types, req.session.data.manure_type)    
    res.redirect('/manner/results')
})

router.get(/manner_update_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 3 //changed
    req.session.data.manner_applications[1].rate = req.session.data.manure_rate
    res.redirect('manner/results')
})

router.get(/manner_results_handler/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 1 //done
    if (req.session.data.manure_rate == null || req.session.data.manure_rate == "" ) {
        req.session.data.manure_rate = 20
    }
    let new_date = req.session.data.manure_date_day + "/" + req.session.data.manure_date_month + "/2026"
    let reference = req.session.data.manner_applications.length + 1
    let tempApplication = {ref: reference, date: new_date, manuretype: req.session.data.manure_type, rate: req.session.data.manure_rate }
    req.session.data.manner_applications.push(tempApplication)
    res.redirect('results')
})

router.get(/manner_values_router/, callback_functions.showSuccessMessage, function (req, res) {
    req.session.data.successMessage = 2 //recalculation
    res.redirect('results#value')
})

router.get(/copy_estimate_handler/, callback_functions.showSuccessMessage, function (req, res) {
    let next = req.session.data.copy_estimate == 'yes' ? 'estimates_list' : 'existing';
    res.redirect(next)
})

router.get(/update_manner_manure_handler/, callback_functions.showSuccessMessage, function (req, res) {
    res.redirect('/update/manner/manure_group')
})

module.exports = router