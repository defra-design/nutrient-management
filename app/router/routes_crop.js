var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');


//handlers

router.get(/update_question_handler/, function (req, res) {
    req.session.data.update_type = req.query.update_type
    console.log(req.session.data.update_type)
    var next
    if (req.query.update_type == 'variety') {
        next = 'variety'
    }
    if (req.query.update_type == 'date') {
        next = 'date/date_question'
    }
    res.redirect(next)
})

router.get(/crop_group_update_v7_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 6;
    if (req.session.data.update_type == 'date') {
        //planting date update
        var tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
        for (var groupRef in req.session.data.currentCropGroups) {
            if (req.session.data.currentCropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
                req.session.data.currentCropGroups[groupRef].planting_date = tempDate
            }
        }
    }
    if (req.session.data.update_type == 'variety') {
        //variety update
        for (var groupRef in req.session.data.currentCropGroups) {
            if (req.session.data.currentCropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
                req.session.data.currentCropGroups[groupRef].variety = req.session.data.new_variety
            }
        }
    }
    //reset temp vars
    req.session.data.new_variety = null
    req.session.data.new_planting_date_day = null
    req.session.data.new_planting_date_month = null
    req.session.data.new_planting_date_year = null
    res.redirect('/farm/crop_plan/plan_view')
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

router.get(/crops_V5_check_handler/, function (req, res) { 
    var sowdate = null;
    var yield = null;
    req.session.data.show_success_message = true;
    var newRef = req.session.data.currentCropGroups.length + 1
    if (req.session.data.sow_date_day != null) {
        sowdate = req.session.data.sow_date_day + '/' + req.session.data.sow_date_month + '/' + req.session.data.sow_date_year
    }
    if (req.session.data.chosen_crop == 'grass') {
        yield = req.session.data.grass_total_yield
        // console.log('yield ' + yield)
        req.session.data.successMessage = 16
    } else {
        req.session.data.successMessage = 1
        yield = '8 tonnes'
    }
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(newRef, 2025, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname, yield, sowdate))
    req.session.data.groupname = null;
    req.session.data.variety = null;
    req.session.data.sow_date_day = null;
    req.session.data.sow_date_month = null;
    req.session.data.sow_date_year = null;
    yield = null;
    res.redirect('/farm/crop_plan/plan_view')
})


router.get(/copyplan_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 17
    req.session.data.oaktree_farm.planning_year = 2026
    res.redirect('/farm/crop_plan/plan_view')
})


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
    res.redirect('add_crops/check')
})


router.get(/groupname_handler/, function (req, res) { 
    var newRef = req.session.data.currentCropGroups.length + 1
    if (req.session.data.groupname.length <= 0) {
        req.session.data.groupname = 'Crop group ' + newRef
    }
    if (req.session.data.chosen_crop != 'grass') {
        res.redirect('variety')
    } else {
        res.redirect('grass/current_sward')
    }
})


router.get(/potato_type_handler/, function (req, res) { 
    // for (var x in req.session.data.potato_details) {
    //     if (req.session.data.potato_details[x].potatoVarietyId == req.session.data.chosen_crop) {
    //         req.session.data.chosen_crop = req.session.data.potato_details[x].potatoVariety + " potatoes"
    //     }
    // }
    req.session.data.chosen_crop = req.session.data.chosen_crop + " potato"
    res.redirect('fields')
})

router.get(/variety_handler/, function (req, res) { 
    if (req.session.data.crop_group == 'potatoes') { 
        if (req.session.data.variety == '' || req.session.data.variety == null) {
            req.session.data.variety = 'Maris Piper'
        }
        req.session.data.chosen_crop = req.session.data.variety + " potato"
    } 
    res.redirect('sowdate_question')
})


//Routers

router.get(/v4_plancopy_router/, function (req, res) { 
    var next = 'crop_group'
    if (req.session.data.plan_copy == 'previous') {
        next = './copy/copy_year'
    }
    res.redirect(next)
})

// ALPHA // add second crops 
router.get(/another_crop_router/, function (req, res) { 
    var next = (req.session.data.second_crop == 'new') ? 'crop_group' : 'second_crop/fields'
    res.redirect(next)
})

// BETA // add second crops 
router.get(/mvp_another_crop_router/, function (req, res) { 
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
                }
            }
        }    
    }
    // console.log(req.session.data.firstFieldReferences)
    var next = (req.session.data.crop_group == 'grass') ? 'grass/current_sward' : 'sowdate_question';
    res.redirect(next);
})

router.get(/yield_question_router/, function (req, res) { 
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

router.get(/v7_grass_yield_handler/, callback_functions.default_grass_values, function (req, res) { 
    res.redirect('../check');
})


router.get(/yield_questiontwo_router/, function (req, res) { 
    var next = (req.session.data.yield_option_two != 'rb209') ? 'yield_value_two' : 'check';
    res.redirect(next);
})

router.get(/yield_handler/, function (req, res) { 
    var next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

router.get(/sowdate_value_router/, function (req, res) { 
    if (req.session.data.crop_group != 'grass') {
        if (req.session.data.sow_option_one != 'no') {
            next = 'sowdate_value'
        } else {
            next = 'yield_question'
        }
    } else {
        if (req.session.data.sow_option_one != 'no') {
            next = 'sowdate_value'
        } else {
            next = 'sward_type'
        }
    }
    res.redirect(next);
})

router.get(/sowdatetwo_value_router/, function (req, res) { 
    var next = (req.session.data.sow_option_two != 'no') ? 'sowdate_value_two' : 'yield_question_two';
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
    res.redirect('fields')
})

router.get(/manner_crop_handler/, function (req, res) { 
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
    res.redirect('manure_group')
})

// Routers

router.get(/season_router/, function (req, res) { 
    var next = (req.session.data.reseed == "yes" || req.session.data.reseed == "new" ) ? 'season' : 'sowdate_question'
    res.redirect(next)
})

router.get(/grass_management_router/, function (req, res) { 
    if (req.session.data.grass_management == 'grazing') {
        req.session.data.defoliations = 'grazings'
    } else if (req.session.data.grass_management == 'hay' || req.session.data.grass_management == 'silage') {
        req.session.data.defoliations = 'cuts'
    } else  {
        req.session.data.defoliations = 'cuts and grazings'
    }
    res.redirect('defoliation')
})

router.get(/yield_total_router/, function (req, res) { 
    var next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
    res.redirect(next)
})

router.get(/management_grass_router/, function (req, res) { 
    var next = '../check'
    if (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") {
        next = 'defoliation_order'
    } else {
        if (req.session.data.sward_type == 'grass') {
            next = 'yield_value_v5'
        }
    }
    res.redirect(next)
})

router.get(/def_sequence_handler/, function (req, res) { 
    var next = '../check'
    if (req.session.data.sward_type == 'grass') {
            next = 'yield_value_v5'
        }
    res.redirect(next)
})

router.get(/yield_loop_handler/, function (req, res) { 
    var next = (req.session.data.crop_fields[1] == null) ? '../check' : 'yield_value_v5a'
    res.redirect(next)
})

router.get(/weight_type_router/, function (req, res) { 
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


module.exports = router