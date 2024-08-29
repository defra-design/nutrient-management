var express = require('express')
var router = express.Router()
const allFunctions = require('../functions/allFunctions.js');

router.get(/v1_farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/v1_fields_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/v1_crop_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})


////////////////////////////////////////////////////////////////////////////
//// V2 ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


router.get(/v2_crop_setup_handler/, function (req, res) {     
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

router.get(/v2_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})


////////////////////////////////////////////////////////////////////////////
//// V4 ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.get(/v4_start_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/v4_farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/v4_field_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/v4_crop_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/v4_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})


////////////////////////////////////////////////////////////////////////////
//// V5 ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.get(/v5_start_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_field_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_onecrop_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'oats-Spring', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_twocrops_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'oats-Spring', 'Wheat-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_twoveg_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.plan_2024.forageCrop = true;
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFieldReferences = [11, 12, 13, 14, 15]
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_grass_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Grass', null, [1, 2, 3, 4, 5, 6, 7])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.multipleManuresApplied = false 
    req.session.data.plan_2023.singleManuresApplied = false
    req.session.data.plan_2023.multipleFertilisersApplied = false 
    req.session.data.plan_2023.singleFertilisersApplied = false

    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Grass', null, [1, 2, 3, 4, 5, 6 ,7])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.multipleManuresApplied = false 
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.plan_2024.multipleFertilisersApplied = false 
    req.session.data.plan_2024.singleFertilisersApplied = false
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

////////////////////////////////////////////////////////////////////////////
//// V5 ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.get(/v6_start_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_field_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fields')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_onecrop_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'oats-Spring', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_twocrops_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'oats-Spring', 'Wheat-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_twoveg_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.plan_2024.forageCrop = true;
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Carrots', 'Beetroot', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondFieldReferences = [11, 12, 13, 14, 15]
    req.session.data.plan_2024.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Wheat-Winter', 'oats-Winter', [1, 2, 3, 4, 5])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Wheat-Winter', null, [1, 2, 3, 4, 5])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

router.get(/v6_grass_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'grass')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    allFunctions.planSetup (req.session.data.plan_2023, 'Grass', null, [1, 2, 3, 4, 5, 6, 7])
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.multipleManuresApplied = false 
    req.session.data.plan_2023.singleManuresApplied = false
    req.session.data.plan_2023.multipleFertilisersApplied = false 
    req.session.data.plan_2023.singleFertilisersApplied = false
    ///2024 plan setup
    allFunctions.planSetup (req.session.data.plan_2024, 'Grass', null, [1, 2, 3, 4, 5, 6 ,7])
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.multipleManuresApplied = false 
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.plan_2024.multipleFertilisersApplied = false 
    req.session.data.plan_2024.singleFertilisersApplied = false
    req.session.data.prototype_version = 'version_5'
    res.redirect('/version_5/start')
})

module.exports = router

//430