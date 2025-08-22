var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');

router.get(/end_to_end_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    var fieldOne = {name: "Long Field",reference: 1, nvz: true,elevation: false};
    var fieldTwo = {name: "Short Field",reference: 2,nvz: true,elevation: false};
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2], req.session.data.all_fields, 'grass', null, 'Crop group 1', '11', null, false))
    var applicationOne = allFunctions.addFertiliserApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.allFertiliserApplications.push(applicationOne)
    res.redirect('start')
})

router.get(/onecrop_v5_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
    res.redirect('start')
})

//full setup
router.get(/plan_setup/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.extra_features = true
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.oaktree_farm.area_added = true
    req.session.data.oaktree_farm.livestock_loading = 'added'
    req.session.data.oaktree_farm.livestock_inventory = 'added'
    req.session.data.oaktree_farm.manure_system = 'added'
    req.session.data.oaktree_farm.manure_system_details = 'added'
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.oaktree_farm.derogation = false
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[4])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[5])
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 'added'
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [8, 12], req.session.data.all_fields, 'Beans-Winter', 'Vespa', 'Crop group 1', null, null, true))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 2', '10 to 13', "12/03/2025", true))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(3, 2025, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', '12', null, false))
    for (var x in req.session.data.all_fertiliser_applications) {
        req.session.data.allFertiliserApplications.push(req.session.data.all_fertiliser_applications[x])
    }
    for (var y in req.session.data.manure_applications_list) {
        req.session.data.allManureApplications_v2.push(req.session.data.manure_applications_list[y])
    }
    res.redirect('start')
})

router.get(/start_setup_handler/, function (req, res) { 
    res.redirect('start')
})

router.get(/farm_setup_handler/, function (req, res) { 
    req.session.data.showinfo = false
    req.session.data.extra_features = true
    req.session.data.oaktree_farm.setup = true
    res.redirect('start')
})

//Farm and fields added
router.get(/end_to_end_field_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    var fieldOne = {name: "Long Field",reference: 1, nvz: true,elevation: false};
    var fieldTwo = {name: "Short Field",reference: 2,nvz: true,elevation: false};
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    res.redirect('start')
})

//Farm fields livestock added
router.get(/end_to_end_livestock_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    var fieldOne = {name: "Long Field",reference: 1, nvz: true,elevation: false};
    var fieldTwo = {name: "Short Field",reference: 2,nvz: true,elevation: false};
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.livestock_types[3].numbers_added_nloading = true;
    req.session.data.livestock_types[3].numbers_added_inventory = false;
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.oaktree_farm.livestock_loading = 'added';
    res.redirect('start')
})


module.exports = router

