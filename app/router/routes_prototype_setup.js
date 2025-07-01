var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');

router.get(/end_to_end_setup_handler/, function (req, res) { 
    req.session.data.showinfo = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    var fieldOne = {name: "Long Field",reference: 1, nvz: true,elevation: false};
    var fieldTwo = {name: "Short Field",reference: 2,nvz: true,elevation: false};
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2], req.session.data.all_fields, 'grass', null, 'Crop group 1', null, null, false))   
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2], req.session.data.all_fields, 'grass', null, 'Crop group 1', '11', null, false))
    var applicationOne = allFunctions.addFertiliserApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.allFertiliserApplications.push(applicationOne)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/onecrop_v5_setup_handler/, function (req, res) { 
    req.session.data.showinfo = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

// router.get(/onecrop_v5_setup_handler/, function (req, res) { 
//     allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
//     req.session.data.all_fields = req.session.data.complete_field_list
//     req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 1', null, null, false))
//     req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
//     req.session.data.prototype_version = req.query.version
//     res.redirect('/' + req.query.version + '/start')
// })

router.get(/twocrops_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', null, 'Crop group 1', '20', null, false))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(2, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Beetroot', null, 'Crop group 2', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Beetroot', null, 'Crop group 2', '50', null, false))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twocropsandmanures_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', null, null, null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', 'Nantes', 'Harvest 1', '15', null, false))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(2, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Carrots', null, null, null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Carrots', 'Nantes', 'Harvest 2', '7', null, false))
    var manureType = 'Cattle Farmyard manure - Old'
    var manure_fields = [1,2,3,4,5]
    var manureDate = '10 September 2024'
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.currentCropGroups, [1], false, 'Nitrogen (N)', '1 March 2024'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/grass_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass', req.session.data.currentCropGroups)
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'grass', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'grass', null, 'Crop group 1', '11', null, false))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/manure_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', null, null, false))
    var manureType = 'Cattle Farmyard manure - Old'
    var manure_fields = [1,2,3,4,5]
    var manureDate = '10 September 2024'
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.currentCropGroups, [1], false, 'Nitrogen (N)', '1 March 2024'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/add_fertiliser_setup/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [11,12,13,14,15,16,17,18,19,20], req.session.data.all_fields, 'grass', null, 'Crop group 2', '11', null, false))
    var manureType = 'Cattle Farmyard manure - Old'
    var manure_fields = [1,2,3,4,5]
    var manureDate = '10 September 2024'
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/add_fertiliser_v5_setup/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 1', '8', null, false))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(2, 2024, [11,12,13,14,15,16,17,18,19,20], req.session.data.all_fields, 'grass', null, 'Crop group 2', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [11,12,13,14,15,16,17,18,19,20], req.session.data.all_fields, 'grass', null, 'Crop group 2', '10', null, false))
    var manureType = 'Cattle Farmyard manure - Old'
    var manure_fields = [1,2,3,4,5]
    var manureDate = '10 September 2024'
    for (var x in manure_fields) {
        var applicationGroup = allFunctions.addManureApplication_v2 (req.session.data.all_fields, req.session.data.currentCropGroups, manure_fields[x], manureDate, manureType)
        req.session.data.allManureApplications_v2.push(applicationGroup)
    }
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/newmanure_setup/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2024, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [8, 12], req.session.data.all_fields, 'Beans-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [8, 12], req.session.data.all_fields, 'Beans-Winter', 'Vespa', 'Crop group 1', '5', null, false))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(2, 2024, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 2', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 2', '8', null, false))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(3, 2024, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(3, 2025, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', '11', null, false))
    for (var x in req.session.data.all_fertiliser_applications) {
        req.session.data.allFertiliserApplications.push(req.session.data.all_fertiliser_applications[x])
    }
    for (var y in req.session.data.manure_applications_list) {
        req.session.data.allManureApplications_v2.push(req.session.data.manure_applications_list[y])
    }
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

//full setup
router.get(/plan_setup/, function (req, res) { 
    req.session.data.showinfo = false
    req.session.data.extra_features = true
    // function createCropGroup (reference, year, field_references, current_fields, crop_reference, variety, group, yield, date) {
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2024, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.oaktree_farm.planning_year = '2025'
    req.session.data.oaktree_farm.livestock_2025 = 'added'
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[1])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[2])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[3])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[13])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[21])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[12])
    req.session.data.livestock_record_2025.push(req.session.data.livestock_types[35])
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 'added'
    req.session.data.oaktree_farm.storage_added = true
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [8, 12], req.session.data.all_fields, 'Beans-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(1, 2025, [8, 12], req.session.data.all_fields, 'Beans-Winter', 'Vespa', 'Crop group 1', null, null, true))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(2, 2024, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 2', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(2, 2025, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Crop group 2', '10 to 13', "12/03/2025", true))
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(3, 2024, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', null, null, false))
    req.session.data.currentCropGroups.push(allFunctions.createCropGroup(3, 2025, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Crop group 3', '12', null, false))
    for (var x in req.session.data.all_fertiliser_applications) {
        req.session.data.allFertiliserApplications.push(req.session.data.all_fertiliser_applications[x])
    }
    for (var y in req.session.data.manure_applications_list) {
        req.session.data.allManureApplications_v2.push(req.session.data.manure_applications_list[y])
    }
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/farm/crop_plan/plan_view')
})


//////////

router.get(/start_setup_handler/, function (req, res) { 
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/farm_setup_handler/, function (req, res) { 
    req.session.data.showinfo = false
    req.session.data.extra_features = true
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/field_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/onecrop_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'oats-Spring', null, [1, 2, 3, 4, 5], null)
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twocrops_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'oats-Spring', 'Wheat-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/crop24_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/grass_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Grass', null, [1, 2, 3, 4, 5, 6, 7], null)
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'Grass', null, [1, 2, 3, 4, 5, 6 ,7], null)
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/manure_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5], null)
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/oneveg_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Carrots', null, [1, 2, 3, 4, 5], null)
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'Carrots', null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], null)
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twoveg_setup_handler/, function (req, res) { 
    req.session.data.plan_2024.forageCrop = true;
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.complete_field_list
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.cropSetup (req.session.data.plan_2024, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

//Farm and fields added
router.get(/end_to_end_field_handler/, function (req, res) { 
    req.session.data.showinfo = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    var fieldOne = {name: "Long Field",reference: 1, nvz: true,elevation: false};
    var fieldTwo = {name: "Short Field",reference: 2,nvz: true,elevation: false};
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/field_v7_setup/, function (req, res) { 
    req.session.data.showinfo = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2024, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.complete_field_list
    req.session.data.oaktree_farm.planning_year = '2025'
    req.session.data.previousCropGroups.push(allFunctions.createCropGroup(1, 2024, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', null, 'Crop group 1', null, null, false))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})


//2025
router.get(/new_setup_handler/, function (req, res) { 
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/farm/crop_plan/plan_view')
})

module.exports = router

