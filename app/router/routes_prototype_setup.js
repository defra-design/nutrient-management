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
    // var newRef = req.session.data.cropGroupsV5.length + 1
    var newGroup = {
        reference: 1,
        year: '2024',
        fields: allFunctions.getMultipleFieldsByReferences([1,2,3,4,5], req.session.data.all_fields),
        crop_reference: 'Wheat-Winter',
        variety: 'Typhoon' 
    }
    req.session.data.cropGroupsV5.push(newGroup)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/twocrops_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    // var newRef = req.session.data.cropGroupsV5.length + 1
    var newGroup = {
        reference: 1,
        year: '2024',
        fields: allFunctions.getMultipleFieldsByReferences([1,2,3,4,5], req.session.data.all_fields),
        crop_reference: 'Carrots',
        variety: null
    }
    var newGroup_2 = {
        reference: 2,
        year: '2024',
        fields: allFunctions.getMultipleFieldsByReferences([1,2,3,4,5,6,7,8,9,10], req.session.data.all_fields),
        crop_reference: 'Beetroot',
        variety: null
    }
    req.session.data.cropGroupsV5.push(newGroup)
    req.session.data.cropGroupsV5.push(newGroup_2)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/grass_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass')
    req.session.data.all_fields = req.session.data.field_list_mvp
    var newGroup = {
        reference: 1,
        year: '2024',
        fields: allFunctions.getMultipleFieldsByReferences([1,2,3,4,5], req.session.data.all_fields),
        crop_reference: 'grass',
        variety: null
    }
    req.session.data.cropGroupsV5.push(newGroup)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})

router.get(/manure_v5_setup_handler/, function (req, res) { 
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    var newGroup = {
        reference: 1,
        year: '2024',
        fields: allFunctions.getMultipleFieldsByReferences([1,2,3,4,5], req.session.data.all_fields),
        crop_reference: 'Wheat-Winter',
        variety: 'Typhoon' 
    }
    req.session.data.cropGroupsV5.push(newGroup)
    req.session.data.prototype_version = req.query.version
    res.redirect('/' + req.query.version + '/start')
})



module.exports = router

//430 < 115
//req.query.chosen_field
//?chosen_field={{field.name}}"