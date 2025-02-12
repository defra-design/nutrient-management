var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//call back functions
const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}

const default_grass_values = function (req, res, next) {
    // if (req.session.data.crop_fields == null || req.session.data.crop_fields == []) {
    //     req.session.data.crop_fields = ['Long Field', 'Short Field']
    // }
    next()
}


//handlers

//current
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

//current
router.get(/crop_group_update_v7_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 6;
    if (req.session.data.update_type == 'date') {
        //planting date update
        var tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
        for (var groupRef in req.session.data.currentCropGroups) {
            if (req.session.data.currentCropGroups[groupRef].reference == req.session.data.chosen_group.reference) {
                req.session.data.currentCropGroups[groupRef].planting_date = tempDate
                console.log('Date ' + req.session.data.chosen_farm_crop_groups[groupRef].planting_date)
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
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//unsure
router.get(/crop_group_update_v6_handler/, function (req, res) { 
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 6;
    console.log('reference ' + req.session.data.chosen_group.reference)
    // console.log(req.session.data.chosen_group)
    if (req.session.data.update_type == 'variety') {
        //variety update
        for (var groupRef in req.session.data.chosen_farm_crop_groups) {
            if (req.session.data.chosen_farm_crop_groups[groupRef].reference == req.session.data.chosen_group.reference) {
                req.session.data.chosen_farm_crop_groups[groupRef].variety = req.session.data.new_variety
            }
        }
    }
    if (req.session.data.update_type == 'date') {
        //planting date update
        var tempDate = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
        for (var groupRef in req.session.data.chosen_farm_crop_groups) {
            if (req.session.data.chosen_farm_crop_groups[groupRef].reference == req.session.data.chosen_group.reference) {
                req.session.data.chosen_farm_crop_groups[groupRef].planting_date = tempDate
                console.log('Date ' + req.session.data.chosen_farm_crop_groups[groupRef].planting_date)
            }
        }
    }
    //reset temp vars
    req.session.data.new_variety = null
    req.session.data.new_planting_date_day = null
    req.session.data.new_planting_date_month = null
    req.session.data.new_planting_date_year = null
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//unsure
router.get(/cropfield_update_handler/, function (req, res) {
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 6;
    // console.log('reference' + req.session.data.chosen_group.reference)
    // console.log(req.session.data.chosen_group)
    
    //variety update
    // for (var x in req.session.data.chosen_farm_fields) {
    //     if (data.chosen_field.reference == req.session.data.chosen_farm_fields[x].reference) {
    //         req.session.data.chosen_farm_fields[x].variety = ""
    //     }
    // }
    // //planting date update
    // for (var x in req.session.data.currentCropGroups) {
    //     if (req.session.data.currentCropGroups[x].reference == req.session.data.chosen_group.reference ) {
    //         req.session.data.currentCropGroups[x].planting_date = req.session.data.new_planting_date_day +'/'+ req.session.data.new_planting_date_month + '/' + req.session.data.new_planting_date_year
    //         // console.log('date' + req.session.data.currentCropGroups[x].planting_date)
    //     }
    // }
    // //reset temp vars
    // req.session.data.new_variety = null
    // req.session.data.new_planting_date_day, req.session.data.new_planting_date_month, req.session.data.new_planting_date_year = null
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//current v7
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

//current v7
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

//current v7
router.get(/crops_V5_check_handler/, function (req, res) { 
    var sowdate = null;
    var yield = null;
    req.session.data.show_success_message = true;
    req.session.data.successMessage = 1;
    var newRef = req.session.data.currentCropGroups.length + 1
    if (req.session.data.sow_date_day != null) {
        sowdate = req.session.data.sow_date_day + '/' + req.session.data.sow_date_month + '/' + req.session.data.sow_date_year
    }
    if (req.session.data.chosen_crop == 'grass') {
        yield = req.session.data.grass_total_yield
        console.log('yield ' + yield)
    }
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(newRef, 2025, req.session.data.crop_fields, req.session.data.all_fields, req.session.data.chosen_crop, req.session.data.variety, req.session.data.groupname, yield, sowdate))
    req.session.data.groupname = null;
    req.session.data.variety = null;
    req.session.data.sow_date_day = null;
    req.session.data.sow_date_month = null;
    req.session.data.sow_date_year = null;
    yield = null;
    res.redirect('/'+ req.session.data.prototype_version + '/farm/crop_plan/plan_view')
})

//current v7 - grass
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


//current v5-7
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


// current v1-7 - Set the chosen_crop
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

// current
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

// current
router.get(/v4_plancopy_router/, function (req, res) { 
    // if (req.session.data.plan_copy == 'new') {
    //     res.redirect('crop_group')
    // } else {
    //     res.redirect('check')
    // }
    res.redirect('crop_group')
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

//current v1-4
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

// current v1-7
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

router.get(/v7_grass_yield_handler/, default_grass_values, function (req, res) { 
    res.redirect('../check');
})


// current v1-7
router.get(/yield_questiontwo_router/, function (req, res) { 
    var next = (req.session.data.yield_option_two != 'rb209') ? 'yield_value_two' : 'check';
    res.redirect(next);
})

// old but v1-7
router.get(/yield_handler/, function (req, res) { 
    var next = (req.session.data.chosen_crop == "Turnips-stubble") ? 'check' : 'crop_use'
    res.redirect(next)
})

// current v1-7
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

// current v1-7
router.get(/sowdatetwo_value_router/, function (req, res) { 
    var next = (req.session.data.sow_option_two != 'no') ? 'sowdate_value_two' : 'yield_question_two';
    res.redirect(next);
})


// current v1-7
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

// old v2,3,4
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

// old
router.get(/grass_use_handler/, function (req, res) { 
    res.redirect('arable_length')
})

//old - Set the chosen_crop OBJECT
router.get(/chosen_crop_handler/, function (req, res) { 
    // for ( var y in req.session.data.crop_types ) {
    //     if(req.session.data.field_details[y].reference === req.query.chosen_field) {
    //         req.session.data.chosen_field = req.session.data.field_details[y]
    //     }
    // }
    res.redirect('crop_when')
})

//old - multi-add status handler
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
    req.session.data.alpha_planning = 1 // recs
    res.redirect('../fields')
})

//old - add crop
router.get(/v2_check_handler/, function (req, res) { 
    if (req.session.data.plan_type == 'previous') {
        req.session.data.alphaPlan2025.plan_update = 'previous_created'
        req.session.data.alphaPlan2025.crop_added = true
        req.session.data.alphaPlan2025.manure_added = true
        req.session.data.alphaPlan2025.fertiliser_added = true
    } else {
        req.session.data.alphaPlan2025.plan_status = 'crop_added';
        req.session.data.alphaPlan2025.crop_added = true
    }
    req.session.data.chosen_plan = req.session.data.alphaPlan2025
    res.redirect('alpha/prototype_3/crop_plan/index')
})



// Routers

//current v5, v7
router.get(/season_router/, function (req, res) { 
    var next = (req.session.data.reseed == "yes" || req.session.data.reseed == "new" ) ? 'season' : 'sowdate_question'
    res.redirect(next)
})

//current v5, v7
router.get(/grass_management_router/, function (req, res) { 
    if (req.session.data.grass_management == 'grazing') {
        req.session.data.content.defoliations = 'grazings'
    } else if (req.session.data.grass_management == 'hay' || req.session.data.grass_management == 'silage') {
        req.session.data.content.defoliations = 'cuts'
    } else  {
        req.session.data.content.defoliations = 'cuts and grazings'
    }
    res.redirect('defoliation')
})

//current v5, v7
router.get(/yield_total_router/, function (req, res) { 
    var next = (req.session.data.yield_total == "multi") ? 'fresh_yield' : 'yield_fresh_single'
    res.redirect(next)
})

//current v5, v7
router.get(/management_grass_router/, function (req, res) { 
    var next = (req.session.data.grass_management == "grazinghay" || req.session.data.grass_management == "grazingsilage") ? 'defoliation_order' : 'yield_value_v4'
    res.redirect(next)
})

//current v5, v7
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

//old - change crop plan
router.get(/crop_change_handler/, function (req, res) { 
    var next = (req.session.data.change_crop == 'add_fertiliser') ? '../plan/fertiliser/fertiliser_when' : '../plan/manure/manure_fields'
    res.redirect(next)
})


module.exports = router