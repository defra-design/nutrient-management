//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

//Data
var farm_details = require('./data/farm_details.json');
var field_details = require('./data/field_details.json');

//set data on index load
router.get('/', function (req, res) { 
    req.session.data.farm_details = farm_details
    req.session.data.field_details = field_details
    req.session.data.chosenfield = null
    // for (var x in field_details) {
    //     console.log ( field_details[x].name )
    // }
    // console.log( `Welcome to ${req.session.data.farm_details.name}` );
    res.render('index')
})

//which filed do you want to create a plan for?
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

//do you plan to spread manure?
router.get(/manure_if_handler/, function (req, res) { 
    if (req.session.data.manure_if == "yes") {
        res.redirect('q5_manure_when')
    } else {
        res.redirect('ending_handler')
    }
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
        res.redirect('ending_handler')
    }
}
})

//set the status
router.get(/ending_handler/, function (req, res) { 
    for ( var y in req.session.data.field_details ) {
        if(req.session.data.field_details[y].reference === req.session.data.chosenfield.reference) {
            req.session.data.field_details[y].planStatus = 'Plan complete'
        }
    }
    //back to all fields
    res.redirect('fields')
})