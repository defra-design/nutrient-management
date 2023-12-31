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
    if (status_text == 'complete') {
        status_text = 'Crop, organic material and inorganic fertiliser added'        
    } else if (status_text == 'crop added') {
        status_text = 'Crop added' 
    } else if (status_text == 'manure added') {
        status_text = 'Manure added' 
    }
    return status_text
})
