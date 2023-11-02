//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

//Data
var farm_details = require('./data/farm_details.json');

router.get('/', function (req, res) { 
    req.session.data.farm_details = farm_details
    // console.log( `Welcome to ${req.session.data.farm_details.name}` );
    res.render('index')
})
