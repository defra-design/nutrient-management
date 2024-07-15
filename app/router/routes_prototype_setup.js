var express = require('express')
var router = express.Router()
const allFunctions = require('../functions/allFunctions.js');

/////////////////////////////
////// PROTOTYPE SETUP //////
/////////////////////////////

router.get(/farm_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/v4_farmsetup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/v4_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

router.get(/fields_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, false, false, false)
    res.redirect('/mvp/start')
})

router.get(/fields_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    // plan for 2025 is empty
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/one_crop_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.plans_added = true
    req.session.data.all_fields = req.session.data.field_list_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_one
    
    //convert the reference numbers to field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.all_fields)
    
    req.session.data.prototype_version = 'mvp'
    res.redirect('/mvp/start')
})

router.get(/plans_mvp_setup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.plan_2023_added = true
    req.session.data.oaktree_farm.plan_2024_added = true
    req.session.data.all_fields = req.session.data.field_list_mvp
    // use populated plan 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_two
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.all_fields)

    res.redirect('/mvp/start')
})

////////////////// + MANURES
router.get(/version2_cropsetup_handler/, function (req, res) { 
    // req.session.data.oaktree_farm.plan_2023_added = true
    // req.session.data.oaktree_farm.plan_2024_added = true
    // req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.setup = true
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.setup = true
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)

    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

////////////////// + FERTILISERS
router.get(/two_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.plan_2023_added = true
    req.session.data.oaktree_farm.plan_2024_added = true
    req.session.data.all_fields = req.session.data.field_list_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.all_fields)

    req.session.data.prototype_version = 'version_2'

    req.session.data.plan_2024.multipleManuresApplied = true
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    req.session.data.show_manure_notification = false

    res.redirect('/version_2/start')
})

router.get(/one_fertiliser_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, true, true)
    req.session.data.oaktree_farm.plan_2023_added = true
    req.session.data.oaktree_farm.plan_2024_added = true
    req.session.data.all_fields = req.session.data.field_list_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.all_fields)
    
    req.session.data.multi_fertiliser = true

    req.session.data.plan_2024.multipleManuresApplied = true
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    req.session.data.show_manure_notification = false

    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})

////////////////// + MANURES
router.get(/version_3_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.oaktree_farm.plan_2023_added = true
    req.session.data.oaktree_farm.plan_2024_added = true

    req.session.data.all_fields = req.session.data.field_list_mvp
    // use plan with one crop 2025
    req.session.data.crop_group_2024 = req.session.data.crop_group_three
    
    //convert the reference numbers to actual field objects
    req.session.data.crop_group_2024.firstCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.firstCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.secondCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.secondCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.thirdCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.thirdCropFields, req.session.data.all_fields)
    req.session.data.crop_group_2024.fourthCropFields = allFunctions.getMultipleFieldsByReferences(req.session.data.crop_group_2024.fourthCropFields, req.session.data.all_fields)

    req.session.data.prototype_version = 'version_3'
    res.redirect('/version_3/start')
})

router.get(/version4_fieldetup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.setup = true
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.setup = false
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

//// ********
router.get(/version4_cropsetup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.setup = true
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.setup = true
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})

//// ********
router.get(/version4_manuresetup_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    ///2023 plan setup
    req.session.data.plan_2023.setup = true
    req.session.data.plan_2023.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2023.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2023.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    req.session.data.plan_2023.secondCropReference = 'oats-Winter'
    req.session.data.plan_2023.secondFieldReferences = [6, 7, 8, 9, 10, 11]
    req.session.data.plan_2023.secondFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.secondFieldReferences, req.session.data.all_fields)
    ///2024 plan setup
    req.session.data.plan_2024.setup = true
    req.session.data.plan_2024.firstCropReference = 'Wheat-Winter'
    req.session.data.plan_2024.firstFieldReferences = [1, 2, 3, 4, 5]
    req.session.data.plan_2024.firstFields = allFunctions.getMultipleFieldsByReferences(req.session.data.plan_2023.firstFieldReferences, req.session.data.all_fields)
    //2024 manures
    req.session.data.plan_2024.multipleManuresApplied = true
    req.session.data.prototype_version = 'version_4'
    res.redirect('/version_4/start')
})


////////////////// + Grass 
router.get(/one_grass_handler/, function (req, res) { 
    req.session.data.show_success_message = false
    allFunctions.basicSetup(req.session.data.oaktree_farm, true, false, false)
    req.session.data.all_fields = req.session.data.field_list_mvp
    // plan for 2025 is empty

    req.session.data.prototype_version = 'version_2'
    res.redirect('/version_2/start')
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router