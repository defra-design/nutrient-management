var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');

var fieldOne = {field_name: "Long Field", field_id: 1, nvz: true, elevation: false};
var fieldTwo = {field_name: "Short Field", field_id: 2, nvz: true, elevation: false};

router.get(/end_to_end_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.oaktree_farm.grass_setup = true
    // req.session.data.cropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2], req.session.data.all_fields, 'grass', null, 'Crop group 1', '11', null, false))
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2], 'grass', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2025, 'grass', [1,2], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    var applicationOne = allFunctions.addFertiliserApplication_v2 (req.session.data.all_fields, req.session.data.cropGroups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.allFertiliserApplications.push(applicationOne)
    res.redirect('start')
})

router.get(/onecrop_v5_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.complete_field_list
    // req.session.data.cropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2,3,4,5], 'Wheat-Winter', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2025, 'Wheat-Winter', [1,2,3,4,5], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

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
    req.session.data.oaktree_farm.livestock_loading = 2
    req.session.data.oaktree_farm.livestock_inventory = 2
    req.session.data.oaktree_farm.manure_system = 2
    req.session.data.oaktree_farm.manure_system_details = 2
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.oaktree_farm.derogation = false
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[4])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[5])
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 2
    req.session.data.oaktree_farm.storage_added = true
    // req.session.data.cropGroups.push(allFunctions.createCropGroup(1, 2025, [8, 12], req.session.data.all_fields, 'Beans-Winter', 'Vespa', 'Crop group 1', null, null, true))
    // req.session.data.cropGroups.push(allFunctions.createCropGroup(2, 2025, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 2', '10 to 13', "12/03/2025", true))
    // req.session.data.cropGroups.push(allFunctions.createCropGroup(3, 2025, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', '12', null, false))
    // var new_group = allFunctions.createCropGroup(group_name, group_id, year, crop_id, field_list, req.session.data.all_fields)
    
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2025, 'Beans-Winter', [8, 12], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2025, 'Wheat-Winter', [1, 4, 5, 6, 7, 14], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2025, 'grass', [10, 11, 18, 19], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_3)

    for (var x in req.session.data.all_fertiliser_applications) {
        req.session.data.allFertiliserApplications.push(req.session.data.all_fertiliser_applications[x])
    }
    for (var y in req.session.data.manure_applications_list) {
        req.session.data.manureGroups.push(req.session.data.manure_applications_list[y])
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

//Farm and fields added - this
router.get(/end_to_end_field_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    res.redirect('start')
})

//Farm fields livestock added
router.get(/end_to_end_livestock_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    
    // Livestock
    req.session.data.livestock_types[0].numbers_added_nloading = 2;
    req.session.data.livestock_types[1].numbers_added_nloading = 2;
    req.session.data.livestock_types[2].numbers_added_nloading = 2;
    req.session.data.livestock_types[3].numbers_added_nloading = 2;
    req.session.data.livestock_types[4].numbers_added_nloading = 2;
    req.session.data.livestock_types[5].numbers_added_nloading = 2;

    req.session.data.livestock_types[24].numbers_added_nloading = 2;

    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[0])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[4])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[5])

    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[24])
    req.session.data.oaktree_farm.livestock_loading = 3;

    res.redirect('start')
})

//Farm fields livestock added
router.get(/livestock_handler_inventory/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    // Livestock
    req.session.data.livestock_types[0].numbers_added_inventory = 2;
    req.session.data.livestock_types[1].numbers_added_inventory = 2;
    req.session.data.livestock_types[2].numbers_added_inventory = 2;
    req.session.data.livestock_types[3].numbers_added_inventory = 2;
    req.session.data.livestock_types[4].numbers_added_inventory = 2;
    req.session.data.livestock_types[5].numbers_added_inventory = 2;
    req.session.data.livestock_types[24].numbers_added_inventory = 2;

    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[0])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[4])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[5])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[24])
    
    req.session.data.oaktree_farm.livestock_inventory = 3;

    res.redirect('start')
})

router.get(/manure_storage_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.oaktree_farm.storage_added = true
    res.redirect('start')
})

router.get(/exports_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.oaktree_farm.imports_exports = 2
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.oaktree_farm.storage_figures = true

    req.session.data.livestock_types[0].numbers_added_inventory = 4;
    req.session.data.livestock_types[1].numbers_added_inventory = 4;
    req.session.data.livestock_types[2].numbers_added_inventory = 4;
    req.session.data.livestock_types[3].numbers_added_inventory = 4;
    req.session.data.livestock_types[4].numbers_added_inventory = 4;
    req.session.data.livestock_types[5].numbers_added_inventory = 4;
    req.session.data.livestock_types[24].numbers_added_inventory = 4;

    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[0])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[4])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[5])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[24])
    
    req.session.data.oaktree_farm.livestock_inventory = 3;

    res.redirect('start')
})

router.get(/inventory_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.oaktree_farm.fields_added = true
    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.oaktree_farm.area_added = true
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 2
    
    // req.session.data.cropGroups.push(group_1)
    // req.session.data.cropGroups.push(group_2)
    // req.session.data.cropGroups.push(group_3)

    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2025, 'Beans-Winter', [8, 12], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2025, 'Wheat-Winter', [1, 4, 5, 6, 7, 14], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2025, 'grass', [10, 11, 18, 19], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_3)

    for (var x in req.session.data.all_fertiliser_applications) {
        req.session.data.allFertiliserApplications.push(req.session.data.all_fertiliser_applications[x])
    }
    for (var y in req.session.data.manure_applications_list) {
        req.session.data.manureGroups.push(req.session.data.manure_applications_list[y])
    }
    res.redirect('start')
})


module.exports = router

