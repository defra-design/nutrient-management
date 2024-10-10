var express = require('express')
var router = express.Router()
const allFunctions = require('../functions/allFunctions.js');

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
    res.redirect('check')
})

//creates a farm
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
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub')
})


// Alert messages
router.get(/delete_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.oaktree_farm.setup = false
    res.redirect('/' + req.session.data.prototype_version + '/farm/farms')
})

//farm view reset messages
router.get(/hub_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/' + req.session.data.prototype_version + '/farm/hub')
})

//manage fields view reset messages
router.get(/field_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/manage-fields')
})

//add a field view reset messages
router.get(/field_add_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/'+ req.session.data.prototype_version + '/add-field/name')
})

//add a field view reset messages
router.get(/copy_field_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    let next = (req.session.data.copy_field == 'yes') ? './copy/fields' : 'name'
    res.redirect(next)
})

//add a field view reset messages
router.get(/field_details_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/field-details')
})

//plan_view reset messages
router.get(/planview_reset_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    res.redirect('../crop_plan/plan_view')
})


/////////////////////////////
////////// ADD FIELD /////////
/////////////////////////////

router.get(/add-field-handler/, function (req, res) { 
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.show_success_message = true
    req.session.data.all_fields.push(req.session.data.tempField)

    req.session.data.plan_2023.setup = true
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences.push(req.session.data.tempField.reference)
    req.session.data.plan_2023.firstFields = req.session.data.all_fields
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/manage-fields')
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
    let next = (req.session.data.oaktree_farm.elevation == 'some') ? 'elevation' : 'soil-one'
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
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference 
    }
    req.session.data.tempField.name = req.session.data.temp_field_name
    res.redirect('./area')
})

router.get(/add_values_handler/, function (req, res) { 
    let next = (req.session.data.add_values == "add_values_index") ? './values_two' : './values_three'
    res.redirect(next)
})

router.get(/sns_handler/, function (req, res) { 
    let next = (req.session.data.sns_method == "yes") ? 'sns/date' : 'sns/crop_group'
    res.redirect(next)
    res.redirect('sns/crop_group')
})

router.get(/sns_v3_handler/, function (req, res) { 
    let next = 'check'
    if (req.session.data.sns_method == "yes") {
        next = 'sns/date'
    }
    res.redirect(next)
})

router.get(/mineralisation_handler/, function (req, res) { 
    let next = (req.session.data.mineralisation == "organic") ? 'organic' : 'adjustment'
    res.redirect(next)
})

router.get(/previous_group_handler/, function (req, res) { 
    var next = 'crop_type_all'
    if (req.session.data.crop_group == null) {
        req.session.data.crop_group = 'cereals'
    }
    if (req.session.data.crop_group == 'other') {
        req.session.data.chosen_crop == 'Other'
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
    let next = (req.session.data.gaiheight == "gai") ? 'gai' : 'height'
    res.redirect(next)
})

router.get(/fieldtype_handler/, function (req, res) { 
    let next = (req.session.data.fieldtype == "copy") ? './copy/fields' : 'name'
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
    res.redirect('/' + req.session.data.prototype_version + '/farm/field/field-details')
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
    if (req.session.data.secondcrop_journey == true) {
        for (var x in req.session.data.crop_fields) {
            for (var y in req.session.data.all_fields) {
                if (req.session.data.all_fields[y].reference == req.session.data.crop_fields[x]) {
                    req.session.data.plan_2024.secondFieldReferences.push(req.session.data.crop_fields[x])
                    req.session.data.plan_2024.secondFields.push(req.session.data.all_fields[y])
                }
            }
        }    
    } else {
        for (var x in req.session.data.crop_fields) {
            for (var y in req.session.data.all_fields) {
                if (req.session.data.all_fields[y].reference == req.session.data.crop_fields[x]) {
                    req.session.data.plan_2024.firstFieldReferences.push(req.session.data.crop_fields[x])
                    req.session.data.plan_2024.firstFields.push(req.session.data.all_fields[y])
                }
            }
        }    
    }
    // console.log(req.session.data.firstFieldReferences)
    if (req.session.data.crop_group == 'grass') {
        res.redirect('grass/current_sward')
     } else {
        res.redirect('sowdate_question')
    }
})

router.get(/v5_fields_handler/, function (req, res) { 
    if (req.session.data.crop_fields === undefined) {
        req.session.data.crop_fields = [11, 12, 13, 14, 15]
    }
    req.session.data.crop_fields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_fields, req.session.data.all_fields)
    if (req.session.data.crop_group == 'grass') {
        res.redirect('grass/current_sward')
     } else {
        res.redirect('group_name')
    }
})

router.get(/cover_handler/, function (req, res) { 
    req.session.data.crop_group_2024.secondCropFields = []
    for (var x in req.session.data.cover_fields) {
        for (var y in req.session.data.all_fields) {
            if (req.session.data.all_fields[y].reference == req.session.data.cover_fields[x]) {
                req.session.data.cover_fields[x] = req.session.data.all_fields[y]
            }
        }
    }
    res.redirect('sowdate_two')
})

router.get(/yield_question_handler/, function (req, res) { 
    let next = 'check'
    if (req.session.data.yield_option_one != 'rb209') {
        next = 'yield_value'
    } else { 
        if (req.session.data.crop_group == 'potatoes') {
            next = 'growth'
        }
        if (req.session.data.crop_group == 'cereals') {
            next = 'crop_use'
        }
    }
    res.redirect(next)
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

router.get(/addcrops_check_handler/, function (req, res) { 
    req.session.data.oaktree_farm.plans_added = true;
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 1;
    req.session.data.plan_2024.setup = true
    if(req.session.data.secondcrop_journey == true) {
        req.session.data.plan_2024.secondCropReference = req.session.data.chosen_crop
        // req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)    
    } else {
        req.session.data.plan_2024.firstCropReference = req.session.data.chosen_crop
        // req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    }
    req.session.data.oaktree_farm.planning_year = 2024;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/crops_V5_check_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 1;
    var newRef = req.session.data.cropGroupsV5.length + 1
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(newRef, 2024, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname))
    req.session.data.groupname = null;
    req.session.data.variety = null;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})


/////////////////////////////
//////// ADD MANURES ////////
/////////////////////////////

router.get(/v2manure_handler/, function (req, res) { 
    req.session.data.manure_journey = req.query.manurejourney
    if (req.session.data.manure_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_fields')
    } else {
        req.session.data.manure_fields = []
        req.session.data.manure_fields.push(req.session.data.chosen_field.reference)
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_group')
    }
})

router.get(/v3manure_journey_handler/, function (req, res) { 
    req.session.data.manure_journey = req.query.manurejourney
    res.redirect('/' + req.session.data.prototype_version + '/add_manure/application_choice')
})

router.get(/v3manure_choice_handler/, function (req, res) { 
    if (req.session.data.manure_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_fields')
    } else {
        res.redirect('/' + req.session.data.prototype_version + '/add_manure/manure_group')
    }
})

router.get(/add_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
})

router.get(/version2_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 2
    if (req.session.data.manure_journey == 'multi') {
        req.session.data.plan_2024.multipleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
    } else {
        req.session.data.plan_2024.singleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/field_plan/index')
    }
})

router.get(/version5_manure_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 4
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

router.get(/manureagain_handler/, function (req, res) { 
    if (req.session.data.manureagain == "yes") {
        req.session.data.manure_count++
        // console.log(req.session.data.manure_count)
        res.redirect('manure_date')
    } else {
        res.redirect('check')
    }
})   

router.get(/manurecheck_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/version_2/add_manure/check')
})

router.get(/manuredate_handler/, function (req, res) { 
    if (req.query.notification == 'true') {
        req.session.data.show_manure_notification = true
    }
    res.redirect('/version_2/add_manure/manure_datenotification')
})

router.get(/manuregroup_handler/, function (req, res) { 
    if (req.session.data.manure_group_id == "livestock") {
        req.session.data.manure_types = req.session.data.manure_types_livestock
    } else if (req.session.data.manure_group_id == "biosolids") {
        req.session.data.manure_types = req.session.data.manure_types_biosolid
    } else if (req.session.data.manure_group_id == "other") {
        req.session.data.manure_types = req.session.data.manure_types_other
    } else if (req.session.data.manure_group_id == "digestate") {
        req.session.data.manure_types = req.session.data.manure_types_digestate
    }
    res.redirect("manure_type")
})

router.get(/manuretype_handler/, function (req, res) {
    //get object
    if (req.session.data.manure_group_id != 'livestock') {
        for (var x in req.session.data.manure_types ) {
            if (req.session.data.manure_types[x].name == req.session.data.manure_type) {
                req.session.data.manure_type = req.session.data.manure_types[x]
            }
        }
    }
    var next = "manure_date"
    if (req.session.data.manure_group_id == "livestock") {
        next = "livestock_type"
        if (req.session.data.manure_type == "dirty_water" ||
            req.session.data.manure_type == "horse_fym" || 
            req.session.data.manure_type == "goat_fym" ||
            req.session.data.manure_type == "poultry") {
            next = "manure_date"
            //get object
            for (var x in req.session.data.manure_types_livestock ) {
                if (req.session.data.manure_types_livestock[x].type == req.session.data.manure_type) {
                    req.session.data.manure_type = req.session.data.manure_types_livestock[x]
                }
            }
        }
    }
    res.redirect(next)
})

router.get(/livestock_type_handler/, function (req, res) {
    // console.log(req.session.data.manure_type)
    //get object
    for (var x in req.session.data.manure_types_livestock) {
        if (req.session.data.manure_types_livestock[x].name == req.session.data.manure_type) {
            req.session.data.manure_type = req.session.data.manure_types_livestock[x]
        }
    }
    res.redirect("manure_date")
})

router.get(/incorporation_handler/, function (req, res) {
    if (req.session.data.incorporation_method == 'not_incorporated') {
        res.redirect("rain_defaults")
    } else {
        res.redirect("manure_delay")
    }
})

router.get(/enter_manure_defualts_handler/, function (req, res) {
    if (req.session.data.edit_manure_defaults === "no") {
        res.redirect("manure_defaults_update")
    } else {
        res.redirect("manure_quantity")
    }
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


router.get(/v2fertiliser_handler/, function (req, res) { 
    req.session.data.fertiliser_journey = req.query.fertiliserjourney
    if (req.session.data.fertiliser_journey == 'multi') {
        res.redirect('/' + req.session.data.prototype_version + '/add_fertiliser/fertiliser_fields')
    } else {
        res.redirect('/' + req.session.data.prototype_version + '/add_fertiliser/fertiliser_when')
    }
})

router.get(/fertiliser_loop_handler/, function (req, res) { 
    if (req.session.data.fertiliser_loop == 'no') {
        res.redirect('check')
    } else {
        req.session.data.fertiliser_count++
        res.redirect('fertiliser_when')
    }
})

//CHECK
router.get(/version2_fertiliser_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 3
    req.session.data.fertiliser_count = 0
    if (req.session.data.fertiliser_journey == 'multi') {
        req.session.data.plan_2024.multipleFertilisersApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
    } else {
        req.session.data.plan_2024.singleFertilisersApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/field_plan/index') 
    }
})

router.get(/fertiliser_v5_update_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 5
    res.redirect('/' + req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})
    
module.exports = router