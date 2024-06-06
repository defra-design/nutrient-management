var express = require('express')
var router = express.Router()
const allFunctions = require('../functions/allFunctions.js');


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
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, false, false, false)
    res.redirect('/mvp/start')
})

router.get(/fields_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    // req.session.data.oaktree_farm.use_mvp_fields = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.current_fields = req.session.data.field_details_mvp
    // plan for 2025 is empty
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/one_crop_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    // req.session.data.oaktree_farm.use_mvp_fields = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_one
    
    //convert the reference numbers to field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)
    
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/plans_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    // req.session.data.oaktree_farm.use_mvp_fields = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    // use populated plan 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_two
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)

    res.redirect('/mvp/start')
})

////////////////// + MANURES
router.get(/one_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    // req.session.data.oaktree_farm.use_mvp_fields = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)

    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

////////////////// + FERTILISERS
router.get(/two_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    // req.session.data.oaktree_farm.setup = true
    // req.session.data.oaktree_farm.fields_added = true
    // req.session.data.oaktree_farm.soil_added = true
    // req.session.data.oaktree_farm.use_mvp_fields = true
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)

    req.session.data.prototype_version = 'version_2'

    req.session.data.multi_manures = true
    req.session.data.single_manures = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    req.session.data.show_manure_notification = false

    res.redirect('/version_2/start')
})

router.get(/one_fertiliser_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, true, true)
    req.session.data.oaktree_farm.planFive = true
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.current_fields = req.session.data.field_details_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)
    
    req.session.data.multi_fertiliser = true

    req.session.data.multi_manures = true
    req.session.data.single_manures = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    req.session.data.show_manure_notification = false

    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
////////// ADD FARM /////////
/////////////////////////////

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
    res.redirect('/add-farm/check')
})

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
    res.redirect('/'+ req.session.data.prototype_version +'/hub')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
////////// ADD FIELD /////////
/////////////////////////////

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

router.get(/soil_type_handler/, function (req, res) { 
    if (req.session.data.oaktree_farm.nvz == 'some' ) {
        res.redirect('nvz')
    } else if (req.session.data.oaktree_farm.elevation == 'some') {
        res.redirect('elevation')
    } else {
        res.redirect('soil-one')
    }
})

router.get(/nvz_handler/, function (req, res) { 
    let next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil'
    res.redirect(next)
})

router.get(/cropuse_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'other') { 
        res.redirect('another_crop')
    } else {
        res.redirect('crop_use')
    }
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
        res.redirect('/add-field/check')
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

router.get(/field_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.latest_update = 'field_updated'
    res.redirect('/' + req.session.data.prototype_version + '/field/field-details')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
//////// ADD CROPS //////////
/////////////////////////////


router.get(/mvp_another_crop_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'other') {
        if (req.session.data.other_selected == 'yes') {
            res.redirect('name_two')
        } else {
            res.redirect('check')

        }
    } else {
        if (req.session.data.cover_crop == 'none') {
            res.redirect('check')
        } else {
            res.redirect('variety_two')
        }
    }
})

router.get(/mvp_fields_handler/, function (req, res) { 
    for (var x in req.session.data.crop_fields) {
        for (var y in req.session.data.current_fields) {
            if (req.session.data.current_fields[y].reference == req.session.data.crop_fields[x]) {
                req.session.data.crop_fields[x] = req.session.data.current_fields[y]
            }
        }
    }
    res.redirect('sowdate_question')
})

router.get(/cover_handler/, function (req, res) { 
    req.session.data.crop_group_2024.secondCropFields = []
    for (var x in req.session.data.cover_fields) {
        for (var y in req.session.data.current_fields) {
            if (req.session.data.current_fields[y].reference == req.session.data.cover_fields[x]) {
                req.session.data.cover_fields[x] = req.session.data.current_fields[y]
            }
        }
    }
    res.redirect('sowdate_two')
})

router.get(/yield_question_handler/, function (req, res) { 
    if (req.session.data.yield_option_one != 'rb209') {
        res.redirect('yield_value')
    } else {
       if (req.session.data.crop_group == 'potatoes') {
            res.redirect('growth')
       } else {
            res.redirect('crop_use')
       }
    }
})

router.get(/yield_questiontwo_handler/, function (req, res) { 
    if (req.session.data.yield_option_two != 'rb209') {
        res.redirect('yield_value_two')
    } else {
        res.redirect('check')
    }
})

router.get(/yield_handler/, function (req, res) { 
    let next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/sowdate_value_handler/, function (req, res) { 
    if (req.session.data.sow_option_one != 'no') {
        res.redirect('sowdate_value')
    } else {
        res.redirect('yield_question')
    }
})

router.get(/sowdatetwo_value_handler/, function (req, res) { 
    if (req.session.data.sow_option_two != 'no') {
        res.redirect('sowdate_value_two')
    } else {
        res.redirect('yield_question_two')
    }
})

router.get(/mvp_check_handler/, function (req, res) { 
    req.session.data.plan2025.plan_status = 'crop_added';
    req.session.data.plan2025.crop_added = true;
    req.session.data.oaktree_farm.plans_added = true;
    req.session.data.show_success_message = true;

    //set plan
    if(req.session.data.crop_group_2024.firstCropReference == null) {
        req.session.data.crop_group_2024.firstCropReference = req.session.data.chosen_crop;
        req.session.data.crop_group_2024.secondCropReference = req.session.data.cover_crop;
        req.session.data.crop_group_2024.firstCropFields = req.session.data.crop_fields;
        req.session.data.crop_group_2024.secondCropFields = req.session.data.cover_fields;
        //get by reference
        req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.current_fields)
        req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.current_fields)
    } else {
        req.session.data.crop_group_2024.thirdCropReference = req.session.data.chosen_crop;
        req.session.data.crop_group_2024.fourthCropReference = req.session.data.cover_crop;
        req.session.data.crop_group_2024.thirdCropFields = req.session.data.crop_fields;
        req.session.data.crop_group_2024.fourthCropFields = req.session.data.cover_fields;
        //get by reference
        req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.current_fields)
        req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.current_fields)    
    }
    req.session.data.crop_group_2024.totalFields = allFunctions.totalFieldsCount(req.session.data.crop_group_2024);

    res.redirect('/'+ req.session.data.prototype_version + '/crop_plan/plan_view')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
/////// ALERT MESSAGES //////
/////////////////////////////


router.get(/delete_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.setup = false
    res.redirect('/' + req.session.data.prototype_version + '/farms')
})

//farm view reset messages
router.get(/hub_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/' + req.session.data.prototype_version + '/hub')
})

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/' + req.session.data.prototype_version + '/field/manage-fields')
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/add-field/name')
})

//add a field view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/field/field-details')
})

//plan_view reset messages
router.get(/planview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('../crop_plan/plan_view')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////
//////// ADD MANURES ////////
/////////////////////////////

router.get(/v2manure_handler/, function (req, res) { 
    req.session.data.manure_journey = req.query.manurejourney
    if (req.session.data.manure_journey == 'multi') {
        res.redirect('/add_manure/manure_fields')
    } else {
        res.redirect('/add_manure/manure_group')
    }
})

router.get(/add_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    res.redirect('/' + req.session.data.prototype_version + '/crop_plan/plan_view')
})

router.get(/version2_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.show_fertiliser_notification = false
    req.session.data.show_manure_notification = true    
    if (req.session.data.manure_journey == 'multi') {
        req.session.data.multi_manures = true
        res.redirect('/version_2/crop_plan/plan_view')
    } else {
        req.session.data.single_manures = true    
        res.redirect('/version_2/field_plan/index')
    }
})

router.get(/manureagain_handler/, function (req, res) { 
    if (req.session.data.manureagain == "yes") {
        req.session.data.manure_count++
        console.log(req.session.data.manure_count)
        res.redirect('manure_date')
    } else {
        res.redirect('check')
    }
})   

router.get(/manurecheck_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/add_manure/check')
})

router.get(/manuredate_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/add_manure/manure_datenotification')
})

router.get(/manuregroup_handler/, function (req, res) { 
    if (req.session.data.manure_group_id == null) {
        req.session.data.manure_group_id == 1
    }
    var next = "/add_manure/manure_type"
    var id = req.session.data.manure_group_id
    if (id == 5 || id == 6 || id == 7 || id == 8 || id == 12 || id == 13 || id == 16 || id == 17 || id == 19 || id == 20|| id == 21 || id == 22) {
        next = "/add_manure/manure_date"
        for (var x in req.session.data.manure_types ) {
            // console.log(req.session.data.manure_types[x])
            if (req.session.data.manure_types[x].group_id == id) {
                req.session.data.manure_type = req.session.data.manure_types[x].name
            }
        }
        
    }
    res.redirect(next)
})

router.get(/manuretype_handler/, function (req, res) {
    if (req.session.data.manure_type == null) {
        req.session.data.manure_type == "Cattle FYM - Old"
    }
    res.redirect("/add_manure/manure_date")
})


// router.get(/manuredate_handler/, function (req, res) { 
//     if (req.session.data.manure_count == 0) {
//         res.redirect('manure_group')
//     } else {
//         res.redirect('manure_again')
//     }
// })



//////////////////////////////////
//////// ADD FERTILISERS /////////
//////////////////////////////////

//START
router.get(/v2fertiliser_handler/, function (req, res) { 
    req.session.data.fertiliser_journey = req.query.fertiliserjourney
    if (req.session.data.fertiliser_journey == 'multi') {
        res.redirect('/add_fertiliser/fertiliser_fields')
    } else {
        res.redirect('/add_manure/fertiliser_amount')
    }
})

//CHECK
    router.get(/version2_fertiliser_handler/, function (req, res) { 
        req.session.data.show_success_message = true
        req.session.data.show_fertiliser_notification = true
        req.session.data.show_manure_notification = false    
        if (req.session.data.fertiliser_journey == 'multi') {
            req.session.data.multi_fertiliser = true
            res.redirect('/version_2/crop_plan/plan_view')
        } else {
            req.session.data.single_fertiliser = true    
            res.redirect('/version_2/field_plan/index')
        }
    })
    
module.exports = router