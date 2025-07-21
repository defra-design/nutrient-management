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

router.get(/storage_size_handler/, function (req, res) {
    var next
    if (req.session.data.material_type == 'solid manure') {
        next = 'weight'
    } else {
        if (req.session.data.storage_question == 'dimensions') {
            next = 'storage_type'
        } else {
            next = 'check'
        }
    }
    res.redirect(next)
})

router.get(/check_storage_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.storage_added = true;
    // req.session.data.successMessage = 2;
    var next = '/' + req.session.data.prototype_version + '/farm/storage/manage_storage'
    res.redirect(next)
})


// router.get(/material_type_handler/, function (req, res) {
//     var next = (req.session.data.material_type == 'solid manure') ? 'storage_type_solid' : 'name'
//     res.redirect(next)
// })


// Livestock routes

router.get(/livestock_report_reset/, hideSuccessMessage, function (req, res) {
    req.session.data.export_type = null
    res.redirect('livestock/livestock_years')
})

router.get(/optional_questions_handler/, hideSuccessMessage, function (req, res) {
    var next
    if (req.session.data.export_type == '8') {
        next = 'system/manure_numbers'
    } else {
        next = 'optional_questions'
    }
    res.redirect(next)
})

router.get(/manure_system_skip_handler/, hideSuccessMessage, function (req, res) {
    var next = (req.session.data.manure_system_skip != 'yes') ? 'check' : './system/manure_numbers'
    res.redirect(next)
})

router.get(/farm_area_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.area_added = true
    res.redirect('checklist')
})

router.get(/livestockentry_handler/, function (req, res) {
    var next = (req.session.data.livestock_entry == 'monthly') ? 'livestock_numbers' : 'livestock_numbers_average'
    res.redirect(next)
})


//inventory routes 

router.get(/slurry_separated_handler/, hideSuccessMessage, function (req, res) {
    var next = '/' + req.session.data.prototype_version + '/add_livestock/system/bedding'
    if (req.session.data.manure_system == 'slurry') {
        next = '/' + req.session.data.prototype_version + '/add_livestock/check'
    }
    res.redirect(next)
})

router.get(/rainwater_area_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.rainwater_area_added = true
    res.redirect('checklist')
})

router.get(/low_risk_land_handler/, hideSuccessMessage, function (req, res) {
    req.session.data.oaktree_farm.low_risk_land_added = 'added'
    if (req.session.data.low_risk_land == 'yes') {
        next = 'area'
    } else {
        next = 'reset_inventory_checklist_message_handler'
    }
    res.redirect(next)
})

router.get(/livestock_number_handler/, function (req, res) {
    // var next = (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') ? 'values_two' : 'check'
    var next = './system/manure_system'
    // if ( (req.session.data.livestock_group == 'pig' || req.session.data.livestock_group == 'poultry') && (req.session.data.livestock_entry == 'monthly') ) {
    //     next = 'values_two'
    // }
    if (req.session.data.export_type == '4' ) {
        next = 'manure_system_skip'
    }
    res.redirect(next)
})


module.exports = router