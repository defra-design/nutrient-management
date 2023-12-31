//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

//Import data
const farm_details = require('./data/farm_details.json');
const field_details = require('./data/field_details.json');
const crop_types = require('./data/crops.json');

let plan2025 = {
    harvest_date: "2025",
    plan_status: null,
    updated: '9 January 2024' 
};

let plan2024 = {
    harvest_date: "2024",
    plan_status: 'complete',
    updated: '10 November 2023' 
};

//Index route loads data in application
router.get('/', function (req, res) { 
    //data
    req.session.data.field_details = field_details
    req.session.data.crop_types = crop_types
    req.session.data.farm_details = farm_details
    req.session.data.chosenfield = null
    req.session.data.crop_group = null
    req.session.data.farms_added = false

    //plan functionality
    req.session.data.plan2024 = plan2024
    req.session.data.plan2025 = plan2025
    
    //create sanitised references for the crop list
    // for(var x in req.session.data.crop_types) {
    //     var y = req.session.data.crop_types[x].name
    //     const regex = / /g
    //     y = y.replace(regex, "-").replace(",", "").toLowerCase()
    //     req.session.data.crop_types[x].reference = y
    // }

    //control vars
    req.session.data.chosen_nutrients = []
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    req.session.data.chosen_crop = null
    req.session.data.chosen_fields = []
    req.session.data.plan_type = 'new'
    req.session.data.show_new_field = false
    req.session.data.another_crop = 'no'
    req.session.data.chosen_plan = null //v2


    // content vars
    req.session.data.organic_term = "Organic material"
    req.session.data.non_organic_term = "Inorganic fertiliser"
    req.session.data.harvest_year = "harvest year 2024"
    req.session.data.todays_date = "8 January 2024"

    // route vars
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0
    res.render('index')
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
    if (req.session.data.manure_if == "yes") {
        res.redirect('manure_when')
    } else {
        res.redirect('check_one')
    }
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
    if (req.session.data.fertiliser_again == "yes") {
        res.redirect('fertiliser_when')
    } else {
        res.redirect('check_two')
    }
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

//add farms
router.get(/add_farms_handler/, function (req, res) { 
    req.session.data.farms_added = true
    res.redirect('/prototype_3/farms')
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
    if (req.session.data.previous_grass == 'yes') {
        res.redirect('plough')
    } else {
        res.redirect('add-field-check')
    }
})

router.get(/field-cuts-handler/, function (req, res) { 
    if (req.session.data.previous_management == 'grazing') {
        res.redirect('previous-nitrogen')
    } else {
        res.redirect('previous-cuts')
    }
})

router.get(/show-field-handler/, function (req, res) { 
    req.session.data.show_new_field = true;
    res.redirect('index')
})


///////////V2

//add another crop
router.get(/v2_another_crop_handler/, function (req, res) { 
    if (req.session.data.another_crop == "yes") {
        res.redirect('crops_grass')
    } else {
        req.session.data.another_crop = 'no';
        res.redirect('check')
    }
})

router.get(/v2_check_handler/, function (req, res) { 
    req.session.data.plan2025.plan_status = 'crop added';
    req.session.data.chosen_plan = req.session.data.plan2025
    res.redirect('/v2/crop_plan')
})

router.get(/v2_manure_check_handler/, function (req, res) { 
    // req.session.data.chosen_plan.plan_status = 'manure added';
    if (req.session.data.chosen_plan.harvest_date == '2025') {
        req.session.data.plan2025.plan_status = 'manure added'
    }
    req.session.data.chosen_plan = req.session.data.plan2025
    console.log(req.session.data.chosen_plan.plan_status)
    res.redirect('/v2/crop_plan')
})

//set the plan by year
router.get(/crop_plan_year_handler/, function (req, res) { 
    if (req.query.harvestdate == '2024') {
        req.session.data.chosen_plan = req.session.data.plan2024
    } else {
        req.session.data.chosen_plan = req.session.data.plan2025
    }
    res.redirect('/v2/crop_plan')
})

router.get(/field_level_plan_handler/, function (req, res) { 
    console.log(req.query.chosenfield)
    req.session.data.chosenfield = req.query.chosenfield
    req.session.data.chosen_crop = req.query.chosencrop
    res.redirect('/v2/field_plan')
})