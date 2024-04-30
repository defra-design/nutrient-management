var express = require('express')
var router = express.Router()

const allFunctions = require('./allFunctions.js');

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
    // if (req.session.data.crop_group == 'grass') { 
    //     req.session.data.chosen_crop = 'grass'
    //     req.session.data.crop_group = null
    //     res.redirect('crop_group')
    // }
     if (req.session.data.crop_group == 'potatoes') { 
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
    if (req.session.data.crop_group == 'potatoes') { 
        res.redirect('crop_type_potato')
    } else {
        if (req.session.data.chosen_crop == null)  {
            req.session.data.chosen_crop = 'Wheat-Winter'
        }
        res.redirect('variety')
    }
})

//potatoes
router.get(/potato_type_handler/, function (req, res) { 
    // for (var x in req.session.data.potato_details) {
    //     if (req.session.data.potato_details[x].potatoVarietyId == req.session.data.chosen_crop) {
    //         req.session.data.chosen_crop = req.session.data.potato_details[x].potatoVariety + " potatoes"
    //     }
    // }
    req.session.data.chosen_crop = req.session.data.chosen_crop + " potatoes"
    res.redirect('fields')
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
    res.redirect('./crop_plan/plan_view')
})

//view the selected plan
router.get(/field_level_plan_handler/, function (req, res) { 
    req.session.data.chosenfield = req.query.chosenfield
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.plan2025.plan_update = null
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('../field_plan/index')
})

router.get(/mvpfield_plan_handler/, function (req, res) { 
    req.session.data.chosenField = allFunctions.getFieldByReference(req.session.data.current_fields, req.query.chosenfield)
    req.session.data.chosen_crop = req.query.chosencrop
    req.session.data.cover_crop = req.query.covercrop
    // req.session.data.plan2025.plan_update = null
    // req.session.data.chosen_plan = req.session.data.plan2025
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


module.exports = router
