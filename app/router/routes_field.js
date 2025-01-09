var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');


//Handlers

//set defaults for farm details
router.get(/set_field_name_handler/, function (req, res) { 
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference;
    }
    req.session.data.tempField.name = req.session.data.temp_field_name;
    res.redirect('./area');
})

//add field
router.get(/add_field_handler/, function (req, res) { 
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.show_success_message = true;
    req.session.data.all_fields.push(req.session.data.tempField);

    req.session.data.plan_2023.setup = true;
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter';
    req.session.data.plan_2023.firstFieldReferences.push(req.session.data.tempField.reference);
    req.session.data.plan_2023.firstFields = req.session.data.all_fields;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/manage-fields');
})

router.get(/copy_name_handler/, function (req, res) { 
    // req.session.data.tempField.name = (req.session.data.temp_field_name == '') ? 'New Field' : req.session.data.temp_field_name
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference 
    }
    req.session.data.tempField.name = req.session.data.temp_field_name
    res.redirect('./copy-field-check')
})


//Routers

router.get(/analysis_option_router/, function (req, res) { 
    var next = (req.session.data.soilanalysis == "yes") ? 'date' : 'previous_use'
    res.redirect(next)
})

router.get(/soil_type_router/, function (req, res) { 
    if (req.session.data.oaktree_farm.nvz == 'some' ) {
        res.redirect('nvz');
    } else if (req.session.data.oaktree_farm.elevation == 'some') {
        res.redirect('elevation');
    } else {
        res.redirect('soil-one');
    }
})

router.get(/nvz_router/, function (req, res) { 
    var next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil-one';
    res.redirect(next);
})

router.get(/copy_field_router/, function (req, res) { 
    req.session.data.show_success_message = false;
    var next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name';
    res.redirect(next)
})

router.get(/previous_group_router/, function (req, res) { 
    var next = 'crop_type_all'
    if (req.session.data.crop_group == null) {
        req.session.data.crop_group = 'cereals'
    }
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop = 'Other'
    } 
    if (req.session.data.crop_group == 'grass') {
        req.session.data.chosen_crop = 'Grass'
        next = 'previous-grass'
    } 
    res.redirect(next)
})

router.get(/previous_clover_router/, function (req, res) { 
    var next = (req.session.data.previous_clover == "yes") ? 'check' : 'previous_nitrogen'
    res.redirect(next)
})

router.get(/previous_cuts_router/, function (req, res) { 
    var next = (req.session.data.previous_management == 'grazed') ? 'previous_clover' : 'previous_cuts_two'
    res.redirect(next)
})

router.get(/previous_use_router/, function (req, res) { 
    if (req.session.data.use_2023 == 'yes') {
        req.session.data.chosen_crop = 'Grass'
        res.redirect('previous_use_two')
    } else {
        res.redirect('crop_group')
    }
})

router.get(/sns_router/, function (req, res) { 
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'sns/crop_group'
    res.redirect(next)
    res.redirect('sns/crop_group')
})

router.get(/sns_v3_router/, function (req, res) { 
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'check';
    res.redirect(next);
})

router.get(/mineralisation_router/, function (req, res) { 
    var next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/fieldtype_router/, function (req, res) { 
    var next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
    res.redirect(next)
})

router.get(/add_values_router/, function (req, res) { 
    var next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

router.get(/log_croptype_router/, function (req, res) {
    if (req.session.data.sns_method == "no") {
        res.redirect('../check')
    } else {
        if (req.session.data.crop_group == 'leafy' || req.session.data.crop_group == 'root') {
            res.redirect('sample_depth')
        //arable    
        } else if (req.session.data.crop_group == 'cereals' || req.session.data.crop_group == 'arable-other') {
            res.redirect('values')
        } else {
            res.redirect('organic_adjustment')
        }    
    }
})

router.get(/gaiheight_router/, function (req, res) { 
    var next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/crop_nitrogen_router/, function (req, res) { 
    var next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

router.get(/mineral_router/, function (req, res) { 
    var next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
})



module.exports = router