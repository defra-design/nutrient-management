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

//set defaults for farm details
router.get(/set_field_name_handler/, function (req, res) { 
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference;
    }
    req.session.data.tempField.name = req.session.data.temp_field_name;
    res.redirect('./area');
})

router.get(/set_tempField_data_handler/, function (req, res) { 
    if (req.session.data.total_area == null || req.session.data.total_area == "" ) {
        req.session.data.total_area = '19'
    }
    if (req.session.data.cropped_area == null || req.session.data.cropped_area == "" ) {
        req.session.data.cropped_area = '17'
    }
    if (req.session.data.non_spreading_area == null || req.session.data.non_spreading_area == "" ) {
        req.session.data.non_spreading_area = '2'
    }
    if (req.session.data.soiltype == null || req.session.data.soiltype == "" ) {
        req.session.data.soiltype = 'Medium'
    }
    if (req.session.data.field_nvz == null || req.session.data.field_nvz == "" ) {
        req.session.data.field_nvz = 'Yes'
    }
    if (req.session.data.field_alt == null || req.session.data.field_alt == "" ) {
        req.session.data.field_alt = 'No'
    }
    if (req.session.data.soilanalysis == null || req.session.data.soilanalysis == "" ) {
        req.session.data.soilanalysis = 'yes'
    }
    if (req.session.data.ph_value == null || req.session.data.ph_value == "" ) {
        req.session.data.ph_value = 2
        req.session.data.phosphorus_index = 1
        req.session.data.potassium_index = 2
        req.session.data.magnesium_index = 1
    }
    // if (req.session.data.soilanalysis == null || req.session.data.soilanalysis == "" ) {
    //     req.session.data.soilanalysis = 'yes'
    // }
    var next = '/'+ req.session.data.prototype_version +'/add-field/check'
    res.redirect(next);
})


//add field
router.get(/add_field_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 3 //field added

    var sowdate = null;
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.all_fields.push(req.session.data.tempField);
    var newRef = req.session.data.currentCropGroups.length + 1
    if (req.session.data.sow_date_day != null) {
        sowdate = req.session.data.sow_date_day + '/' + req.session.data.sow_date_month + '/' + req.session.data.sow_date_year
    }
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(newRef, 2024, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname, null, sowdate))
    console.log(req.session.data.tempField)
    console.log(req.session.data.previousCropGroups)
    //reset temp vars
    req.session.data.chosen_crop = null
    req.session.data.total_area = null
    req.session.data.cropped_area = null
    req.session.data.non_spreading_area = null
    req.session.data.soiltype = null
    req.session.data.field_nvz = null
    req.session.data.field_alt = null
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/manage-fields');
})

router.get(/add_sns_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 17;
    req.session.data.chosen_group.sns = true;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field_plan/index');
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

router.get(/field_update_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 4 //field updated
    req.session.data.oaktree_farm.latest_update = 'field_updated'
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/field-details')
})

router.get(/soil_update_handler/, showSuccessMessage, function (req, res) { 
    req.session.data.successMessage = 5 //soil updated
    req.session.data.oaktree_farm.latest_update = 'field_updated'
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/field-details')
})


//Routers


router.get(/split_field_router/, function (req, res) { 
    var next = (req.session.data.splitmerge == "split") ? './split/number' : './merge/fields'
    res.redirect(next)
})

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
        next = 'crop_type_all'
    } 
    if (req.session.data.crop_group == 'grass') {
        req.session.data.chosen_crop = 'Grass'
        next = 'previous-grass'
    } 
    if (req.session.data.crop_group == 'herbs') {
        req.session.data.chosen_crop = 'Herbs'
        next = 'check'
    } 
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop = 'Other'
        next = 'check'
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
    var next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'set_tempField_data_handler';
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