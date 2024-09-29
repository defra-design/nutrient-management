var express = require('express')
var router = express.Router()
const allFunctions = require('../functions/allFunctions.js');

router.get(/start_setup_handler/, function (req, res) { 
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/farm_setup_handler/, function (req, res) { 
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/field_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.cropSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/onecrop_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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
    req.session.data.all_fields = req.session.data.field_list_mvp
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

router.get(/onecrop_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Group 1'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twocrops_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', null, 'Group 1'))
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(2, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Beetroot', null, 'Group 2'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twocropsandmanures_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Carrots', 'Nantes', 'Harvest 1'))
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(2, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Carotts', 'Nantes', 'Harvest 2'))
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.cropGroupsV5, [1], true, 'Cattle Farmyard manure - Old', '10 September 2024'))
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.cropGroupsV5, [1], false, 'Nitrogen (N)', '1 March 2024'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/grass_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass', req.session.data.cropGroupsV5)
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'grass', null, 'Group 1'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/manure_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Group 1'))
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.cropGroupsV5, [1], true, 'Cattle Farmyard manure - Old', '10 September 2024'))
    req.session.data.allManureApplications.push(allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.cropGroupsV5, [1], false, 'Nitrogen (N)', '1 March 2024'))
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/add_fertiliser_setup/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Group 1'))
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(2, 2024, [11,12,13,14,15,16,17,18,19,20], req.session.data.all_fields, 'grass', null, 'Group 2'))
    let applicationGroup = allFunctions.addManureApplication (req.session.data.allManureApplications, req.session.data.cropGroupsV5, [1], true, 'Cattle Farmyard manure - Old', '10 September 2024')
    req.session.data.allManureApplications.push(applicationGroup)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})


router.get(/newmanure_setup/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(1, 2024, [8, 12], req.session.data.all_fields, 'Beans-Winter', 'Vespa', 'Group 1'))
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(2, 2024, [1, 4, 5, 6, 7, 14], req.session.data.all_fields, 'Wheat-Winter', 'Skyfall', 'Group 2'))
    req.session.data.cropGroupsV5.push(allFunctions.createCropGroup(3, 2024, [10, 11, 18, 19], req.session.data.all_fields, 'grass', null, 'Group 3'))
    var newApplicationGroup_1 = {
        reference: req.session.data.allManureApplications.length + 1,
        crop_group_references: [1,2,3,4,5],
        field_count: 5,
        organic: true,
        manure_type: 'Cattle Farmyard manure - Old',
        application_date: '10 September 2024'
    }
    var newApplicationGroup_2 = {
        reference: req.session.data.allManureApplications.length + 1,
        crop_group_references: [1,2,3,4,5],
        field_count: 5,
        organic: false,
        manure_type: 'Nitrogen (N)',
        application_date: '1 March 2024'
    }

    req.session.data.allManureApplications.push(newApplicationGroup_1)
    req.session.data.allManureApplications.push(newApplicationGroup_2)

    let applicationGroup = allFunctions.addFertiliserApplication (req.session.data.allFertiliserApplications, req.session.data.all_fields, [1,2], ['56 kg Potash (K2O)', '56 kg Phosphate (P2O5)'], '288 kg', '20/09/2023')
    req.session.data.allFertiliserApplications.push(applicationGroup)

    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

module.exports = router

