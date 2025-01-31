var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//cb functions
const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}

//Handlers

router.get(/planning_year_handler/, function (req, res) { 
    var next = '/add_crops/crop_group'
    req.session.data.oaktree_farm.planning_year = req.query.year
    if (req.session.data.prototype_version == 'version_3' || req.session.data.prototype_version == 'version_4') {
        next = '/add_crops/create_next'
    }
    if (req.query.year == '2024') {
        next = '/farm/crop_plan/plan_view'
    }
    res.redirect('/'+ req.session.data.prototype_version + next)
})

router.get(/field_level_plan_v5_handler/, hideSuccessMessage, function (req, res) { 
    req.session.data.chosen_group = req.query.fieldref
    req.session.data.chosen_field = req.query.groupref
    req.session.data.chosen_year = req.query.year
    // console.log(req.session.data.chosen_group)
    // console.log(req.session.data.chosen_field)
    //group.reference 
    if (req.session.data.chosen_year == 2024) {
        req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.previousCropGroups, req.query.groupref)
    } else {
        req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
    }
    //field reference
    req.session.data.chosen_field = allFunctions.getFieldByReference(req.session.data.all_fields, req.query.fieldref)    
    res.redirect('../field_plan/index')
})

router.get(/group_level_plan_v7_handler/, function (req, res) { 
    req.session.data.chosen_group = req.query.groupref
    req.session.data.chosen_year = req.query.year
    console.log(req.session.data.chosen_year)
    //group.reference
    if (req.session.data.chosen_year == 2024) {
        req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
    } else {
        req.session.data.chosen_group = allFunctions.getGroupByReference(req.session.data.currentCropGroups, req.query.groupref)
    }
    req.session.data.show_success_message = false    
    console.log(req.session.data.chosen_group)
    var next = 'update/crop/change_crop'
    console.log(req.session.data.chosen_group.crop_reference)
    if (req.session.data.chosen_group.crop_reference == 'grass') {
        next = 'update/grass/change_crop'
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
router.get(/add_farm_handler/, function (req, res) { 
    //name
    req.session.data.oaktree_farm.name = req.session.data.farm_name;
    //postcode
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode;
    //NVZ
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz;
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation;
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer;
    req.session.data.oaktree_farm.setup = true;
    req.session.data.oaktree_farm.latest_update = 'added';
    req.session.data.show_success_message = true;
    // console.log(req.session.data.oaktree_farm)
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub');
})

//Routers

router.get(/start_router/, function (req, res) { 
    var next = 'about'
    if (req.session.data.showinfo == false) {
        next = '/farm/farms'
    }
    res.redirect('/' + req.session.data.prototype_version + next);
})


router.get(/hub_reset_router/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/hub');
})



module.exports = router