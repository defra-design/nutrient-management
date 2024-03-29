var express = require('express')
var router = express.Router()

/////////////////////////////
/// PROTOTYPE SETUP ////////
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

//Set the chosenfield OBJECT
router.get(/create_plan_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.query.chosenfield) {
            req.session.data.chosenfield = req.session.data.field_details[y]
        }
    }
    if (req.session.data.chosenfield.planStatus == "crop_added") {
        req.session.data.chosen_crop = req.session.data.chosenfield.crop
        if (req.session.data.chosenfield.crop == "grass") {
            res.redirect('grass/current_sward')
        } else {
            res.redirect('crop_when')
        }
    } else {
        res.redirect('create')
    }
})

router.get(/view_plan_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.query.chosenfield) {
            req.session.data.chosenfield = req.session.data.field_details[y]
        }
    }
    res.redirect('/create/plan')
})

//how do you want to create your plan? 
router.get(/plan-type-handler/, function (req, res) { 
    if (req.session.data.plan_type == "previous") {
        req.session.data.crop_group = "Arable cereals"
        req.session.data.chosen_crop = "Wheat-Winter"
        res.redirect('check_last_year')
    } else if (req.session.data.plan_type == "other") {
        res.redirect('other_plan')
    } else {
        //new
    res.redirect('use')
    }
})

//grass or arable?
router.get(/crop_type_handler/, function (req, res) { 
    if (req.session.data.field_use == "arable") {
        res.redirect('crop_group')
    } else {
        req.session.data.chosen_crop = "grass"
        res.redirect('grass/current_sward')
    }
})

//do you plan to spread manure?
router.get(/manure_if_handler/, function (req, res) { 
    let next = (req.session.data.manure_if == "yes") ? 'manure_when' : 'check_one'
    res.redirect(next)
})

//manure application loops
router.get(/manure_counter_updater/, function (req, res) { 
    req.session.data.manure_spreads++
    res.redirect('manure_type')
})

//do you plan to spread manure multiple times
router.get(/manure_again_handler/, function (req, res) { 
if (req.session.data.manure_again == "yes") {
    res.redirect('manure_when')
} else {
    if (req.session.data.plan_type == "new") {
        res.redirect('check_one')
    } else {
        res.redirect('set_status')
    }
}
})

//set the plan status
router.get(/set_status/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if (req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            if (req.session.data.plan_type == "previous") {
                req.session.data.field_details[y].planStatus = 'recommendations'
            } else {
                req.session.data.field_details[y].planStatus = 'Plan complete'
            }
            req.session.data.field_details[y].crop = req.session.data.chosen_crop
        }
    }
    req.session.data.farm_details.plan_status = 'new';
    res.redirect('fields')
})

// update the status of the plan for chosenfield to nul, recs, full

//set the status to recommendations
router.get(/recs_status_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            req.session.data.field_details[y].planStatus = 'recommendations'
            req.session.data.field_details[y].crop = req.session.data.chosen_crop
        }
    }
    req.session.data.farm_details.plan_status = "recommendations"
    res.redirect('/create/recs')
})

//FERTILISER
////////////

//do you plan to spread fertiliser?
router.get(/fertiliser_if_handler/, function (req, res) { 

    if (req.session.data.fertiliser_if == "yes") {
        if( req.session.data.chosen_crop == 'grass') {
            res.redirect('./grass/inorganic_defoliation')

        } else {
            res.redirect('fertiliser_when')
        }
    } else {
        res.redirect('check_two')
    }
})

//do you plan to spread more fertiliser
router.get(/fertiliser_again_handler/, function (req, res) { 
    let next = (req.session.data.fertiliser_again == "yes") ? 'fertiliser_when' : 'check_two'
    res.redirect(next)
})

//manure application loops
router.get(/fertiliser_counter_updater/, function (req, res) { 
    req.session.data.fertiliser_spreads++
    res.redirect('fertiliser_type')
})
    
//fertiliser application types loop
router.get(/fertiliser_types_handler/, function (req, res) { 
    var chosen_nutrients = req.session.data.chosen_nutrients
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    for (var x in chosen_nutrients) {
        if (chosen_nutrients[x] == "nitrogen") {
            req.session.data.chosen_nitrogen = true;
        } else if (chosen_nutrients[x] == "phosphate") {
            req.session.data.chosen_phosphate = true;
        } else if (chosen_nutrients[x] == "potash") {
            req.session.data.chosen_potash = true;
        } else if (chosen_nutrients[x] == "sulphur") {
            req.session.data.chosen_sulphur = true;
        } else if (chosen_nutrients[x] == "lime") {
            req.session.data.chosen_lime = true;
        }
    }
    res.redirect('fertiliser_amount_table')
})

//crop 
router.get(/crop_group_handler/, function (req, res) { 
    if (req.session.data.crop_group == "other") {
        res.redirect('crop_when')
    } else {
        res.redirect('crop_type_all')
    }
})

router.get(/cropmvp_handler/, function (req, res) { 
    if (req.session.data.crop_group == "other") {
        res.redirect('fields')
    } else if (req.session.data.crop_group == 'grass') { 
        req.session.data.chosen_crop = 'grass'
        req.session.data.crop_group = null
        res.redirect('crop_group')
    } else if (req.session.data.crop_group == null) { 
        req.session.data.crop_group = 'cereals'
        res.redirect('crop_type_all')
    } else {
        res.redirect('crop_type_all')
    }
})

//grass
router.get(/grass_use_handler/, function (req, res) { 
    res.redirect('arable_length')
})

//Set the chosen_crop OBJECT
router.get(/chosen_crop_handler/, function (req, res) { 
    // for ( var y in req.session.data.crop_types ) {
    //     if(req.session.data.field_details[y].reference === req.query.chosenfield) {
    //         req.session.data.chosenfield = req.session.data.field_details[y]
    //     }
    // }
    res.redirect('crop_when')
})

//multi-add status handler
router.get(/add_multi_handler/, function (req, res) { 
    for (var x in req.session.data.chosen_fields) {
        for (var y in req.session.data.field_details) {
            if (req.session.data.field_details[y].reference == req.session.data.chosen_fields[x] ) {
                req.session.data.field_details[y].planStatus = "crop_added"
                req.session.data.field_details[y].crop = req.session.data.chosen_crop
            }
        }
    }
    console.log("chosen crop" + req.session.data.chosen_crop)
    req.session.data.chosen_fields = []
    res.redirect('../fields')
})

//add field - grass history - handler
router.get(/add-grass-handler/, function (req, res) { 
    let next = (req.session.data.previous_grass == 'yes') ? 'plough' : 'add-field-check'
    res.redirect(next)
})

router.get(/field-cuts-handler/, function (req, res) { 
    let next = (req.session.data.previous_management == 'grazing') ? 'previous-nitrogen' : 'previous-cuts'
    res.redirect(next)
})

router.get(/show-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.fields_added = true;
    res.redirect('../field/manage-fields')
})

///////////
///////  V2
///////////

//add another
router.get(/v2_another_crop_handler/, function (req, res) { 
    if (req.session.data.another_crop == "yes") {
        res.redirect('crops_grass')
    } else {
        req.session.data.another_crop = 'no';
        res.redirect('check')
    }
})

// select plan type
router.get(/v2_plan_handler/, function (req, res) { 
    if (req.session.data.v2_plan_type == 'new') {
        req.session.data.plan_type = 'new'
        res.redirect('/v2/plan/crops')
    } else {
        req.session.data.plan_type = 'previous'
        res.redirect('/v2/plan/check')
    }
})

//add crop
router.get(/v2_check_handler/, function (req, res) { 
    if (req.session.data.plan_type == 'previous') {
        req.session.data.plan2025.plan_update = 'previous_created'
        req.session.data.plan2025.crop_added = true
        req.session.data.plan2025.manure_added = true
        req.session.data.plan2025.fertiliser_added = true
    } else {
        req.session.data.plan2025.plan_status = 'crop_added';
        req.session.data.plan2025.crop_added = true
    }
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('/v2/crop_plan/index')
})

//view the plan by year
router.get(/crop_plan_year_handler/, function (req, res) { 
    if (req.query.harvestdate == '2024') {
        req.session.data.chosen_plan = req.session.data.plan2024
    } else {
        req.session.data.plan2025.plan_update = null
        req.session.data.chosen_plan = req.session.data.plan2025
    }
    res.redirect('./crop_plan/index')
})

//view the selected plan
router.get(/field_level_plan_handler/, function (req, res) { 
    req.session.data.chosenfield = req.query.chosenfield
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.plan2025.plan_update = null
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('../field_plan/index')
})

//add manure
router.get(/v2_manure_check_handler/, function (req, res) { 
    // req.session.data.chosen_plan.plan_status = 'manure added';
    if (req.session.data.chosen_plan.harvest_date == '2025') {
        req.session.data.plan2025.manure_added = true
        req.session.data.plan2025.plan_update = 'manure_added'
    }
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('/v2/crop_plan/index')
})

//add fertiliser
router.get(/v2_check_fertiliser_handler/, function (req, res) { 
    req.session.data.plan2025.fertiliser_added = true
    req.session.data.plan2025.plan_update = 'fertiliser_added'
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('/v2/crop_plan/index')
})

//change crop plan
router.get(/crop_change_handler/, function (req, res) { 
    let next = (req.session.data.change_crop == 'plan_fertiliser') ? '../plan/fertiliser/fertiliser_when' : '../plan/manure/manure_fields'
    res.redirect(next)
})

//show the right fertilisers
router.get(/fertiliser_type_handler_v2/, function (req, res) { 
    var chosen_nutrients = req.session.data.chosen_nutrients
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    for (var x in chosen_nutrients) {
        if (chosen_nutrients[x] == "nitrogen") {
            req.session.data.chosen_nitrogen = true;
        } else if (chosen_nutrients[x] == "phosphate") {
            req.session.data.chosen_phosphate = true;
        } else if (chosen_nutrients[x] == "potash") {
            req.session.data.chosen_potash = true;
        } else if (chosen_nutrients[x] == "sulphur") {
            req.session.data.chosen_sulphur = true;
        } else if (chosen_nutrients[x] == "lime") {
            req.session.data.chosen_lime = true;
        }
    }
    res.redirect('fertiliser_amount')
})

//select a field
router.get(/field-select-handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.chosenfield = req.query.chosenfield
    res.redirect('field-details')
})

//update soil
router.get(/add_soil_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.latest_update = 'soil-added'
    req.session.data.oaktree_farm.soil_added = true
    res.redirect('../field/field-details')
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


module.exports = router
