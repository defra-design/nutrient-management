var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//set defaults for farm details
router.get(/set_field_name/, function (req, res) { 
    req.session.data.tempField.reference = req.session.data.all_fields.length + 1;
    if (req.session.data.temp_field_name == "") {
        req.session.data.temp_field_name = 'New Field #' + req.session.data.tempField.reference;
    }
    req.session.data.tempField.name = req.session.data.temp_field_name;
    res.redirect('./area');
})

router.get(/add_field_handler/, function (req, res) { 
    req.session.data.oaktree_farm.latest_update = 'field_added';
    req.session.data.oaktree_farm.fields_added = true;
    req.session.data.show_success_message = true;
    req.session.data.all_fields.push(req.session.data.tempField);

    req.session.data.plan_2023.setup = true;
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter';
    req.session.data.plan_2023.firstFieldReferences.push(req.session.data.tempField.reference);
    req.session.data.plan_2023.firstFields = req.session.data.all_fields;
    res.redirect('/'+ req.session.data.prototype_version +'/farm/field/manage-fields');
})

module.exports = router