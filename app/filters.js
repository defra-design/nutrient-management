//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

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

addFilter('nameconverter', function (content) {
    // // if (content == "rye-winter") {
    // //     content = "Winter Rye"
    // // }
    // for (var x in crop_types) {
    //     if (content == crop_types[x].name)
    //     content = crop_types[x].type
    // }
    return content;
})

