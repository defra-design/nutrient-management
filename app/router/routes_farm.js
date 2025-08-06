var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

//Handlers

router.get(/field_level_plan_v5_handler/, callback_functions.hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = req.query.fieldref
    req.session.data.chosen_field = req.query.groupref
    //group.reference 
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
    //field reference
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)    
    res.redirect('../field_plan/index')
})

router.get(/group_level_plan_v7_handler/, function (req, res) { 
    req.session.data.chosen_group = req.query.groupref
    req.session.data.chosen_year = req.query.year
    console.log(req.session.data.chosen_year)
    //group.reference
    req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
    req.session.data.show_success_message = false    
    console.log(req.session.data.chosen_group)
    var next = '../../update/crop/change_crop'
    console.log(req.session.data.chosen_group.crop_reference)
    if (req.session.data.chosen_group.crop_reference == 'grass') {
        next = '../../update/grass/change_crop'
    }
    res.redirect(next)
})

//set defaults for farm details
router.get(/set_farm_defaults_handler/, function (req, res) { 
    //name
    if (req.session.data.farm_name == "") {
        req.session.data.farm_name = 'Oaktree Lane Farm';
    }
    //postcode
    if (req.session.data.farm_postcode == "") {
        req.session.data.farm_postcode = 'NE46 7LQ';
    }
    //NVZ
    if (req.session.data.farm_nvz == "") {
        req.session.data.farm_nvz = 'all';
    }
    //elevation
    if (req.session.data.farm_elevation == "") {
        req.session.data.farm_elevation = 'none';
    }
    //organic
    // if (req.session.data.organic_producer == "" || req.session.data.organic_producer == 'no' ) {
    //     req.session.data.organic_producer = false;
    // } else {
    //     req.session.data.organic_producer = true;
    // }  
    res.redirect('check');
})

//creates a farm
router.get(/add_farm_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 1 //farm added

    req.session.data.oaktree_farm.name = req.session.data.farm_name;
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode;
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz;
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation;
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer;
    req.session.data.oaktree_farm.setup = true;
    req.session.data.oaktree_farm.latest_update = 'added'; //remove this
    res.redirect('/farm/hub');
})

//removes a farm
router.get(/delete_handler/, callback_functions.showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 2 //farm removed
    req.session.data.oaktree_farm.setup = false;
    res.redirect('/farm/farms');
})


//Routers

router.get(/start_router/, function (req, res) { 
    var next = '/disclaimer'
    if (req.session.data.showinfo == false) {
        next = '/farm/farms'
    }
    res.redirect(next);
})

router.get(/hub_reset_router/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/farm/hub');
})


//hide success message
router.get(/plan_view_reset_router/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/farm/crop_plan/plan_view');
})

//hub reset messages
router.get(/farmsview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/farm/farms');
})


module.exports = router