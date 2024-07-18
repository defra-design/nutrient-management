//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// const allFunctions = require('../functions/allFunctions.js');

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

addFilter('removewhite', function (content) {
    content = content.replace(/\s/g, "");
    content = content.toLowerCase();
    return content
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
    var newName = field_name;
    if (field_name == "newfield") {
        newName = "New Field"
    } else {
        newName = field_name.substr(0, 5) + "     " + field_name.substr(5)
    }
    return newName    
})

addFilter('statusconverter', function (status_text) {
    if (status_text == 'manure_added') {
        status_text = 'Manure applications added.'        
    } else if (status_text == 'crop_added') {
        status_text = 'Plan created.' 
    } else if (status_text == 'previous_created') {
        status_text = 'New plan created.' 
    } else if (status_text == 'fertiliser_added') {
        status_text = 'Fertiliser applications added.' 
    }
    return status_text
})

addFilter('convert_true_false', function (status) {
    if (status == false) {
        status = 'No'      
    } else  {
        status = 'Yes'
    }
    return status
})

addFilter('convert_all_some_none', function (status) {
    if (status == 'all') {
        status = 'All'      
    } else if (status == 'some')  {
        status = 'Some'
    } else {
        status = "None"
    }
    return status
})

addFilter('array_count', function (array) {
    let counter = 0
    for (var item in array) {
        counter++
    }
    return counter
})

addFilter('convert_manure_group_id', function (group_id) {
    if (group_id == 'livestock') {
        group_name = "Livestock manure"
    } else if (group_id == 'biosolids') {
        group_name = "Biosolids"
    } else if (group_id == 'digestate') {
        group_name = "Digestate"
    } else if (group_id == 'other') {
        group_name = "Other organic materials"
    } else {
        group_name = group_id
    }
    return group_name
})