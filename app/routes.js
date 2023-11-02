//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

//Data
var farmDetails = require('./data/farm_details.json');
console.log("Welcome to " + `${farmDetails.name}`);