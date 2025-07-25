var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');


// Alert messages

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) {
    req.session.data.show_success_message = false;
    res.redirect('/farm/field/manage-fields');
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('add-field/name');
})

//add a field view reset messages
router.get(/field_copy_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('add-field/copy_field');
})

//field details view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/farm/field/field-details');
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

//add field - grass history - handler
router.get(/add-grass-handler/, function (req, res) { 
    var next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'check'
    res.redirect(next)
})

router.get(/addcrops_handler/, function (req, res) { 
    req.session.data.secondcrop_journey = true
    res.redirect('add_crops/another_crop')
})

router.get(/foragecrops_check_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.plan_2024.forageCrop = true;
    req.session.data.oaktree_farm.planning_year = 2024;
    res.redirect('/farm/crop_plan/plan_view')
})



module.exports = router