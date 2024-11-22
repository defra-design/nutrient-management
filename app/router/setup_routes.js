var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//yes/no for soil analysis
router.get(/analysis_option_handler/, function (req, res) { 
    var next = (req.session.data.soilanalysis == "yes") ? 'date' : 'previous_use'
    res.redirect(next)
})

//export the documents
router.get(/export_handler/, function (req, res) { 
    if (req.session.data.export_type == 1) {
        next = 'export_fields'
    } else if (req.session.data.export_type == 2) {
        next = './outputs/workbook'
    } else {
        next = './outputs/nmax_report_v2'
    }
    res.redirect(next)
})

///////////////////// refactor

// Alert messages
router.get(/delete_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.oaktree_farm.setup = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/farms');
})

//farm view reset messages
router.get(/hub_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/hub');
})

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) {
    req.session.data.show_success_message = false;
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/manage-fields');
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version + '/add-field/name');
})

//add a field view reset messages
router.get(/copy_field_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    var next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name';
    res.redirect(next)
})

//add a field view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/field-details');
})

//plan_view reset messages
router.get(/planview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false;
    res.redirect('../crop_plan/plan_view');
})

////Farm

router.get(/organic_handler/, function (req, res) { 
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
router.get(/add_farms_handler/, function (req, res) { 
    //name
    req.session.data.oaktree_farm.name = req.session.data.farm_name;
    //postcode
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode;
    //NVZ
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz;
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation;
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer ;
    req.session.data.oaktree_farm.setup = true;
    req.session.data.oaktree_farm.latest_update = 'added';
    req.session.data.show_success_message = true;
    // console.log(req.session.data.oaktree_farm)
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub');
})


//// FIELD 
router.get(/add-field-handler/, function (req, res) { 
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

router.get(/soil_type_handler/, function (req, res) { 
    if (req.session.data.oaktree_farm.nvz == 'some' ) {
        res.redirect('nvz');
    } else if (req.session.data.oaktree_farm.elevation == 'some') {
        res.redirect('elevation');
    } else {
        res.redirect('soil-one');
    }
})

router.get(/nvz_handler/, function (req, res) { 
    var next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil-one';
    res.redirect(next);
})

router.get(/cropuse_handler/, function (req, res) { 
    var next = (req.session.data.crop_group == 'other') ? 'another_crop' : 'crop_use';
    res.redirect(next);
})

router.get(/field_name_handler/, function (req, res) { 
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference;
    }
    req.session.data.tempField.name = req.session.data.temp_field_name;
    res.redirect('./area');
})

router.get(/add_values_handler/, function (req, res) { 
    var next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

router.get(/sns_handler/, function (req, res) { 
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'sns/crop_group'
    res.redirect(next)
    res.redirect('sns/crop_group')
})

router.get(/sns_v3_handler/, function (req, res) { 
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'check';
    res.redirect(next);
})

router.get(/mineralisation_handler/, function (req, res) { 
    var next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/previous_group_handler/, function (req, res) { 
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

router.get(/log_croptype_handler/, function (req, res) {
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

router.get(/organicadjustment_handler/, function (req, res) { 
    if (req.session.data.chosen_crop == "Oilseed-Spring" || req.session.data.chosen_crop == "Oilseed-Winter") {
        res.redirect('gai_height')
    } else if (req.session.data.crop_group == "cereals" || req.session.data.crop_group == 'arable-other') {
        res.redirect('shoots')
    } else {
        res.redirect('/add-field/check')
    }
})

router.get(/gaiheight_handler/, function (req, res) { 
    var next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/fieldtype_handler/, function (req, res) { 
    var next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
    res.redirect(next)
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

router.get(/crop_nitrogen_handler/, function (req, res) { 
    var next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

router.get(/mineral_handler/, function (req, res) { 
    var next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
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

//grass
router.get(/grassyield_handler/, function (req, res) { 
    if (req.session.data.defoliation_one == null) {
        req.session.data.defoliation_one = 'Grazing'
    }
    if (req.session.data.defoliation_two == null) {
        req.session.data.defoliation_two = 'Grazing'
    }
    if (req.session.data.defoliation_three == null) {
        req.session.data.defoliation_three = 'Grazing'
    }
    if (req.session.data.defoliation_four == null) {
        req.session.data.defoliation_four = 'Grazing'
    }
    if (req.session.data.weight_type == null) {
        req.session.data.weight_type = 'Fresh cut weight'
    }
    res.redirect('/'+ req.session.data.prototype_version + '/add_crops/check')
})

router.get(/previous_use_handler/, function (req, res) { 
    if (req.session.data.use_2023 == 'yes') {
        req.session.data.chosen_crop = 'Grass'
        res.redirect('previous_use_two')
    } else {
        res.redirect('crop_group')
    }
})
 
router.get(/another_crop_handler/, function (req, res) { 
    var next = (req.session.data.second_crop == 'new') ? 'crop_group' : 'second_crop/fields'
    res.redirect(next)
})

router.get(/previous_cuts_handler/, function (req, res) { 
    var next = (req.session.data.previous_management == 'grazed') ? 'previous_nitrogen' : 'previous_cuts_two'
    res.redirect(next)
})


router.get(/export_field_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 7;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

module.exports = router