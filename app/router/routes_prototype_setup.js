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
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2024.secondCropReference = 'oats-Winter'
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
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
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
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

router.get(/v2_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
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
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
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
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/v4_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'manures')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
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
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_crop_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'crops')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v5_manure_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, 'fertilisers')
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2024.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

module.exports = router

//246