var express = require('express')
var router = express.Router()

/////////////////////////////
////// PROTOTYPE SETUP //////
/////////////////////////////
router.get(/farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    res.redirect('/mvp/start')
})

router.get(/fields_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    res.redirect('/mvp/start')
})

router.get(/fields_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.oaktree_farm.use_mvp_fields = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    req.session.data.oaktree_farm.soil_added = true
    res.redirect('/mvp/start')
})

router.get(/plans_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.oaktree_farm.use_mvp_fields = true
    req.session.data.chosen_plan = req.session.data.plan2025
    req.session.data.current_fields = req.session.data.field_details_mvp
    req.session.data.oaktree_farm.soil_added = true
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    res.redirect('/mvp/start')
})

//////MVP

//add crop
router.get(/mvp_check_handler/, function (req, res) { 
    req.session.data.plan2025.plan_status = 'crop_added';
    req.session.data.plan2025.crop_added = true
    req.session.data.chosen_plan = req.session.data.plan2025
    req.session.data.oaktree_farm.plans_added = true
    res.redirect('/mvp/crop_plan/index')
})

////MVP add a field
router.get(/add-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.soil_added = true
    var tempString = req.session.data.tempField.name
    tempString = tempString.toLowerCase()
    tempString = tempString.replace(/\s/g,'')
    req.session.data.tempField.reference = tempString
    console.log('name = ' + req.session.data.tempField.name)
    console.log('reference = ' + req.session.data.tempField.reference)
    req.session.data.current_fields.push(req.session.data.tempField)
    console.log(req.session.data.tempField)
    res.redirect('/mvp/field/manage-fields')
})

//farm view reset messages
router.get(/hub_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/mvp/hub')
})

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/mvp/field/manage-fields')
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/mvp/add-field/name')
})

//add a field view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/mvp/field/field-details')
})

router.get(/organic_handler/, function (req, res) { 
    //name
    if (req.session.data.farm_name == "") {
        req.session.data.farm_name = req.session.data.oaktree_farm.name
    }
    //postcode
    if (req.session.data.farm_postcode == "") {
        req.session.data.farm_postcode = req.session.data.oaktree_farm.postcode
    }
    //NVZ
    if (req.session.data.farm_nvz == "none") {
        req.session.data.farm_nvz = req.session.data.oaktree_farm.nvz
    }
    //elevation
    if (req.session.data.farm_elevation == "none") {
        req.session.data.farm_elevation = req.session.data.oaktree_farm.elevation
    }
    //organic
    if (req.session.data.organic_producer == "") {
        req.session.data.organic_producer = req.session.data.oaktree_farm.organic_producer
    } else if (req.session.data.organic_producer == 'yes')  {
        req.session.data.organic_producer = true
    }  else if (req.session.data.organic_producer == 'no')  {
        req.session.data.organic_producer = false
    }  
    // console.log('nvz = ' + req.session.data.farm_nvz )
    // console.log('organic = ' + req.session.data.organic_producer )
    // console.log('elevation = ' + req.session.data.farm_elevation )
    // console.log(req.session.data.oaktree_farm)
    res.redirect('/mvp/add-farm/check')
})

router.get(/soil_type_handler/, function (req, res) { 
    if (req.session.data.oaktree_farm.nvz == 'some' ) {
        res.redirect('nvz')
    } else if (req.session.data.oaktree_farm.elevation == 'some') {
        res.redirect('elevation')
    } else {
        res.redirect('soil')
    }
})

router.get(/nvz_handler/, function (req, res) { 
    let next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil'
    res.redirect(next)
})

//add farms
router.get(/add_farms_handler/, function (req, res) { 
    //name
    req.session.data.oaktree_farm.name = req.session.data.farm_name
    //postcode
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode
    //NVZ
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.latest_update = 'added'
    req.session.data.show_success_message = true
    // console.log(req.session.data.oaktree_farm)
    res.redirect('../hub')
})

/////// MVP Crops
//Set the chosen_crop
router.get(/mvp_crop_handler/, function (req, res) { 
    if (req.session.data.chosen_crop == null) { 
        req.session.data.chosen_crop = 'Wheat-Winter'
    }
    res.redirect('variety')
})

//add another crop
router.get(/mvp_another_crop_handler/, function (req, res) { 
    let next = (req.session.data.another_crop == "yes") ? 'crop_type_second' : 'check'
    res.redirect(next)
})

router.get(/field_name_handler/, function (req, res) { 
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field'
    }
    req.session.data.tempField.name = req.session.data.temp_field_name
    res.redirect('./area')
})

router.get(/add_values_handler/, function (req, res) { 
    let next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

router.get(/sns_handler/, function (req, res) { 
    res.redirect('sns/crop_group')
})

router.get(/mineralisation_handler/, function (req, res) { 
    let next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/previous_group_handler/, function (req, res) { 
    console.log(req.session.data.crop_group)
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop == 'Other'
        res.redirect('log_croptype_handler')
    } else {
        res.redirect('crop_type_all')
    }
})

router.get(/log_croptype_handler/, function (req, res) {
    console.log(req.session.data.chosen_crop)
    if (req.session.data.sns_method == "no") {
        res.redirect('/mvp/add-field/add-field-check')
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
        res.redirect('/mvp/add-field/add-field-check')
    }
})

router.get(/gaiheight_handler/, function (req, res) { 
    let next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/fieldtype_handler/, function (req, res) { 
    let next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
    res.redirect(next)
})

router.get(/copy_name_handler/, function (req, res) { 
    req.session.data.tempField.name = (req.session.data.temp_field_name == '') ? 'New Field' : req.session.data.temp_field_name
    res.redirect('./copy-field-check')
})

router.get(/crop_nitrogen_handler/, function (req, res) { 
    let next = (req.session.data.crop_nitrogen == "yes") ? 'shoots' : 'nitrogen_mineralisation'
    res.redirect(next)
})

router.get(/mineral_handler/, function (req, res) { 
    let next = (req.session.data.nitrogen_mineralisation == "no") ? 'sns_index' : 'organic_adjustment'
    res.redirect(next)
})

router.get(/secondcrop_handler/, function (req, res) { 
    let next = ('variety_two')
    console.log(req.session.data.chosen_crop)
    res.redirect(next)
})

router.get(/yield_handler/, function (req, res) { 
    let next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/mvp_fields_handler/, function (req, res) { 
    for (var x in req.session.data.crop_fields) {
        for (var y in req.session.data.current_fields) {
            if (req.session.data.current_fields[y].reference == req.session.data.crop_fields[x]) {
                console.log(req.session.data.current_fields[y])
            }
        }
    }
    res.redirect('sowdate')
})

router.get(/mvp_date_handler/, function (req, res) { 
    // if(req.session.data.alldate == 'yes') {
    //     res.redirect('yield')
    // }
    // show the first chosen field
    // if they dont check the box 
    // show the next chosen field
    // if there's no more fields go to yield
    res.redirect('yield')
})



module.exports = router
