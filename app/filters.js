//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

const field_details = require('./data/field_details.json');


// Add your filters here

const crop_types = require('./data/crops.json');

// addFilter('uppercase', function (content) {
//   return content.toUpperCase()
// })

addFilter('smartify', function (content) {
    return content.replace(',', ',  ').replace('-', ', ');
})

addFilter('splitlines', function (content) {
    return content.replace('.', '\n');
})

addFilter('nameconverter', function (crop_name) {
    for (var x in crop_types) {
        if (crop_name == crop_types[x].reference) {
            crop_name = crop_types[x].prettyname;
        }
    }
    return crop_name
})

addFilter('fieldconverter', function (field_name) {
    var newName = field_name.substr(0, 5) + "     " + field_name.substr(5)
    return newName
})

addFilter('statusconverter', function (status_text) {
    if (status_text == 'manure_added') {
        status_text = 'Manure applications added to plan.'        
    } else if (status_text == 'crop_added') {
        status_text = 'Crops added to plan' 
    } else if (status_text == 'previous_created') {
        status_text = 'New plan created.' 
    } else if (status_text == 'fertiliser_added') {
        status_text = 'Fertiliser applications added to plan.' 
    }
    return status_text
})

