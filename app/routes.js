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

//Index route loads data in application
router.get('/', function (req, res) { 
    //data
    req.session.data.field_details = field_details
    req.session.data.chosenfield = null

    // content vars
    req.session.data.organic_term = "Organic material"
    req.session.data.non_organic_term = "Inorganic fertiliser"
    req.session.data.harvest_year = "2023 to 2024"

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
    res.redirect('q1_create')
})

//how do you want to create your plan? 
router.get(/plan-type-handler/, function (req, res) { 
    if (req.session.data.plan_type == "previous") {
        res.redirect('check_last_year')
    } else if (req.session.data.plan_type == "other") {
        res.redirect('check_last_year')
    } else {
        //new
    res.redirect('q1_use')
    }
})

//grass or arable?
router.get(/crop_type_handler/, function (req, res) { 
    if (req.session.data.field_use == "arable") {
        res.redirect('q2_crop_group')
    } else {
        res.redirect('q2_grass')
    }
})

//do you plan to spraed manure?
router.get(/manure_if_handler/, function (req, res) { 
    if (req.session.data.manure_if == "yes") {
        res.redirect('q5_manure_when')
    } else {
        res.redirect('check_one')
    }
})

//manure application loops
router.get(/manure_counter_updater/, function (req, res) { 
    req.session.data.manure_spreads++
    res.redirect('q6_manure_again')
})

//do you plan to spread manure multiple times
router.get(/manure_again_handler/, function (req, res) { 
    console.log( `manure_again ${req.session.data.manure_again}` );
if (req.session.data.manure_again == "yes") {
    res.redirect('q5_manure_when')
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
    res.redirect('fields')
})

// update the status of the plan foir chosenfield to nul, recs, full

//set the status to recomendations
router.get(/recs_status_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            req.session.data.field_details[y].planStatus = 'recommendations'
        }
    }
    res.redirect('recs')
})


//FERTILISER
////////////

//do you plan to spraed fertiliser?
router.get(/fertiliser_if_handler/, function (req, res) { 
    if (req.session.data.fertiliser_if == "yes") {
        res.redirect('q8_fertiliser_when')
    } else {
        res.redirect('check_two')
    }
})

//do you plan to spread more firtiliser
router.get(/fertiliser_again_handler/, function (req, res) { 
    if (req.session.data.fertiliser_again == "yes") {
        res.redirect('q8_fertiliser_when')
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
    res.redirect('q9_fertiliser_again')
})
    

