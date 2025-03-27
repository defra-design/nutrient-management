var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//export the documents
router.get(/export_handler/, function (req, res) { 
    // if (req.session.data.export_type == 1) {
    //     next = 'export_fields'
    // } else if (req.session.data.export_type == 2) {
    //     next = './outputs/workbook'
    // } else {
    //     next = './outputs/nmax_report_v2'
    // }
    var next = 'export_fields'
    if (req.session.data.export_type == 3) {
        next = 'export_crops'
    }
    res.redirect(next)
})

///////////////////// refactor

// Alert messages

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) {
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/manage-fields');
})

//manage manure view reset messages
router.get(/manure_reset_handler/, function (req, res) {
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/manure/manage-manure');
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version + '/add-field/name');
})

//add a field view reset messages
router.get(/field_copy_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version + '/add-field/copy_field');
})

//field details view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/field-details');
})

//plan_view reset messages
router.get(/planview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('../crop_plan/plan_view');
})


//// FIELD 

router.get(/cropuse_handler/, function (req, res) { 
    var next = (req.session.data.crop_group == 'other') ? 'another_crop' : 'crop_use';
    res.redirect(next);
})

router.get(/organicadjustment_handler/, function (req, res) { 
    if (req.session.data.chosen_crop == "Oilseed-Spring" || req.session.data.chosen_crop == "Oilseed-Winter") {
        res.redirect('gai_height')
    } else if (req.session.data.crop_group == "cereals" || req.session.data.crop_group == 'arable-other') {
        res.redirect('shoots')
    } else {
        res.redirect('/add-field/check')
    }
})

router.get(/field_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.latest_update = 'field_updated'
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/field-details')
})

//add field - grass history - handler
router.get(/add-grass-handler/, function (req, res) { 
    var next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'check'
    res.redirect(next)
})

router.get(/field-cuts-handler/, function (req, res) { 
    var next = (req.session.data.previous_management == 'grazing') ? 'previous-nitrogen' : 'previous-cuts'
    res.redirect(next)
})

router.get(/show-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.fields_added = true;
    res.redirect('../field/manage-fields')
})

router.get(/addcrops_handler/, function (req, res) { 
    req.session.data.secondcrop_journey = true
    res.redirect('/'+ req.session.data.prototype_version + '/add_crops/another_crop')
})

router.get(/foragecrops_check_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.plan_2024.forageCrop = true;
    req.session.data.oaktree_farm.planning_year = 2024;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})



module.exports = router