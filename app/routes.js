//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

//Import data
var farm_details = require('./data/farm_details.json');
var field_details = require('./data/field_details.json');
var crop_types = require('./data/crops.json');

//Index route loads data in application
router.get('/', function (req, res) { 
    //data
    req.session.data.field_details = field_details
    req.session.data.crop_types = crop_types
    req.session.data.farm_details = farm_details
    req.session.data.chosenfield = null
    req.session.data.crop_group = null
    req.session.data.farms_added = false

    //create sanitised references for the crop list
    for(var x in req.session.data.crop_types) {
        var y = req.session.data.crop_types[x].name
        const regex = / /g
        y = y.replace(regex, "-").replace(",", "").toLowerCase()
        req.session.data.crop_types[x].reference = y
    }

    //control vars
    req.session.data.chosen_nutrients = []
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false

    // content vars
    req.session.data.organic_term = "Organic material"
    req.session.data.non_organic_term = "Inorganic fertiliser"
    req.session.data.harvest_year = "harvest year 2024"

    // route vars
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0
    
    // for (var x in field_details) {
    //     console.log ( field_details[x].name )
    // }
    // console.log( `Welcome to ${req.session.data.farm_details.name}` );

    res.render('index')
})

//which field do you want to create a plan for?
router.get(/create_plan_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.query.chosenfield) {
            req.session.data.chosenfield = req.session.data.field_details[y]
        }
    }
    console.log(req.session.data.chosenfield.name)
    if (req.session.data.chosenfield.planStatus == "crop_added") {
    res.redirect('crop_when')
    } else {
        res.redirect('create')
    }
})

//how do you want to create your plan? 
router.get(/plan-type-handler/, function (req, res) { 
    if (req.session.data.plan_type == "previous") {
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
        res.redirect('grass')
    }
})

//do you plan to spraed manure?
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
    console.log( `manure_again ${req.session.data.manure_again}` );
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

//set the status
router.get(/set_status/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            req.session.data.field_details[y].planStatus = 'Plan complete'
        }
    }
    req.session.data.farm_details.plan_status = "recommendations"
    res.redirect('fields')
})

// update the status of the plan foir chosenfield to nul, recs, full

//set the status to recommendations
router.get(/recs_status_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            req.session.data.field_details[y].planStatus = 'recommendations'
        }
    }
    req.session.data.farm_details.plan_status = "recommendations"
    res.redirect('recs')
})


//FERTILISER
////////////

//do you plan to spraed fertiliser?
router.get(/fertiliser_if_handler/, function (req, res) { 
    if (req.session.data.fertiliser_if == "yes") {
        res.redirect('fertiliser_when')
    } else {
        res.redirect('check_two')
    }
})

//do you plan to spread more firtiliser
router.get(/fertiliser_again_handler/, function (req, res) { 
    if (req.session.data.fertiliser_again == "yes") {
        res.redirect('fertiliser_when')
    } else {
        if (req.session.data.plan_type == "new") {
            res.redirect('check_two')
        } else {
            res.redirect('set_status')
        }
    }
})

//manure application loops
router.get(/fertiliser_counter_updater/, function (req, res) { 
    req.session.data.fertiliser_spreads++
    res.redirect('fertiliser_type')
})
    
//manure application loops
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
    res.redirect('fertiliser_amount')
})

//crops
router.get(/crop_group_handler/, function (req, res) { 
        if (req.session.data.crop_group == "other") {
            res.redirect('crop_when')
        } else {
            res.redirect('crop_type_all')
        }
})

//multi-add status handler
router.get(/multi_add_handler/, function (req, res) { 
    for (var x in req.session.data.chosen_fields) {
        for (var y in req.session.data.field_details) {
            if (req.session.data.field_details[y].reference == req.session.data.chosen_fields[x] ) {
                req.session.data.field_details[y].planStatus = "crop_added"
                console.log(req.session.data.field_details[y].name + " planStatus = " + req.session.data.field_details[y].planStatus )
            }
        }
    }
    // continue planning and use an if to make decisions (if status == 'crops_added')
    res.redirect('../fields')
})

//add farms

router.get(/add_farms_handler/, function (req, res) { 
    req.session.data.farms_added = true
    res.redirect('/prototype_3/farms')
})