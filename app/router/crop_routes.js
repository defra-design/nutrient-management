var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

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

//////////////////////////////////////////////// refactor


//// ADD CROPS 
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
        for (var a in req.session.data.crop_fields) {
            for (var b in req.session.data.all_fields) {
                if (req.session.data.all_fields[b].reference == req.session.data.crop_fields[a]) {
                    req.session.data.plan_2024.firstFieldReferences.push(req.session.data.crop_fields[a])
                    req.session.data.plan_2024.firstFields.push(req.session.data.all_fields[b])
                }
            }
        }    
    }
    // console.log(req.session.data.firstFieldReferences)
    var next = (req.session.data.crop_group == 'grass') ? 'grass/current_sward' : 'sowdate_question';
    res.redirect(next);
})

router.get(/v5_fields_handler/, function (req, res) { 
    if (req.session.data.crop_fields === undefined) {
        req.session.data.crop_fields = [11, 12, 13, 14, 15]
    }
    req.session.data.crop_fields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_fields, req.session.data.all_fields)
    // if (req.session.data.crop_group == 'grass') {
    //     res.redirect('grass/current_sward')
    //  } else {
    //     res.redirect('group_name')
    // }
    res.redirect('group_name')
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
    var next = 'check'
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
    var next = (req.session.data.yield_option_two != 'rb209') ? 'yield_value_two' : 'check';
    res.redirect(next);
})

router.get(/yield_handler/, function (req, res) { 
    var next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/sowdate_value_handler/, function (req, res) { 
    var next = (req.session.data.sow_option_one != 'no') ? 'sowdate_value' : 'yield_question';
    res.redirect(next);
})

router.get(/sowdatetwo_value_handler/, function (req, res) { 
    var next = (req.session.data.sow_option_two != 'no') ? 'sowdate_value_two' : 'yield_question_two';
    res.redirect(next);
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
    var sowdate = null;
    req.session.data.successMessage = 1;
    var newRef = req.session.data.cropGroupsV5.length + 1
    if (req.session.data.sow_date_day != null) {
        sowdate = req.session.data.sow_date_day + '/' + req.session.data.sow_date_month + '/' + req.session.data.sow_date_year
    }
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(newRef, 2024, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname, sowdate))
    req.session.data.groupname = null;
    req.session.data.variety = null;
    req.session.data.sow_date_day = null;
    req.session.data.sow_date_month = null;
    req.session.data.sow_date_year = null;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//crop 
router.get(/crop_group_handler/, function (req, res) { 
    var next = (req.session.data.crop_group == "other") ? 'crop_when' : 'crop_type_all';
    res.redirect(next);
})

router.get(/cropmvp_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'grass') { 
        req.session.data.chosen_crop = 'grass'
        res.redirect('fields')
    } else if (req.session.data.crop_group == 'potatoes') { 
        res.redirect('crop_type_potato')
    } else if (req.session.data.crop_group == null) { 
        req.session.data.crop_group = 'cereals'
        res.redirect('crop_type_all')
    } else {
        res.redirect('crop_type_all')
    }
})

/////// MVP Crops
//Set the chosen_crop
router.get(/mvp_crop_handler/, function (req, res) { 
    // if (req.session.data.crop_group == 'potatoes') { 
    //     res.redirect('crop_type_potato')
    // }
    if (req.session.data.chosen_crop == null || req.session.data.chosen_crop == '')  {
        if (req.session.data.crop_group == 'other') {
            req.session.data.chosen_crop = 'Flax'
        } else {
            req.session.data.chosen_crop = 'Winter Wheat'
        }
    }
    res.redirect('variety')
})

router.get(/variety_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'potatoes') { 
        if (req.session.data.variety == '' || req.session.data.variety == null) {
            req.session.data.variety = 'Maris Piper'
        }
        req.session.data.chosen_crop = req.session.data.variety + " potato"
    } 
    res.redirect('fields')
})

router.get(/groupname_handler/, function (req, res) { 
    var newRef = req.session.data.cropGroupsV5.length + 1
    if (req.session.data.groupname.length <= 0) {
        req.session.data.groupname = 'Crop group ' + newRef
    }
    if (req.session.data.chosen_crop != 'grass') {
        res.redirect('sowdate_question')
    } else {
        res.redirect('grass/current_sward')
    }
})


//potatoes
router.get(/potato_type_handler/, function (req, res) { 
    // for (var x in req.session.data.potato_details) {
    //     if (req.session.data.potato_details[x].potatoVarietyId == req.session.data.chosen_crop) {
    //         req.session.data.chosen_crop = req.session.data.potato_details[x].potatoVariety + " potatoes"
    //     }
    // }
    req.session.data.chosen_crop = req.session.data.chosen_crop + " potato"
    res.redirect('fields')
})

//grass
router.get(/grass_use_handler/, function (req, res) { 
    res.redirect('arable_length')
})

//Set the chosen_crop OBJECT
router.get(/chosen_crop_handler/, function (req, res) { 
    // for ( var y in req.session.data.crop_types ) {
    //     if(req.session.data.field_details[y].reference === req.query.chosen_field) {
    //         req.session.data.chosen_field = req.session.data.field_details[y]
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
    req.session.data.chosen_fields = []
    res.redirect('../fields')
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
    res.redirect('old/v2/crop_plan/index')
})

//change crop plan
router.get(/crop_change_handler/, function (req, res) { 
    var next = (req.session.data.change_crop == 'add_fertiliser') ? '../old/plan/fertiliser/fertiliser_when' : '../old/plan/add_manure/manure_fields'
    res.redirect(next)
})

router.get(/weight_type_handler/, function (req, res) { 
    var next = 'yield_value_dry';
    if (req.session.data.yield_type == "fresh") {
        if (req.session.data.grass_management == 'grazinghay' || req.session.data.grass_management == 'grazingsilage' ) {
            next = 'fresh_yield'
        } else {
            next = 'yield_total'
        }
    }
    res.redirect(next)
})

router.get(/management_handler/, function (req, res) { 
    var next = (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") ? 'defoliation_order' : 'yield_type'
    res.redirect(next)
})

router.get(/yield_total_handler/, function (req, res) { 
    var next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
    res.redirect(next)
})

router.get(/grass_management_hander/, function (req, res) { 
    if (req.session.data.grass_management == 'grazing') {
        req.session.data.content.defoliations = 'grazings'
    } else if (req.session.data.grass_management == 'hay' || req.session.data.grass_management == 'silage') {
        req.session.data.content.defoliations = 'cuts'
    } else  {
        req.session.data.content.defoliations = 'cuts and grazings'
    }
    res.redirect('defoliation')
})

router.get(/season_handler/, function (req, res) { 
    var next = (req.session.data.reseed == "yes") ? 'season' : 'sward_type'
    res.redirect(next)
})


module.exports = router