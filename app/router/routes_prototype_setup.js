var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');

let oaktree_farm = {
      created: true,
      name:  "Oaktree Lane Farm",
      postcode:  "NE46 7LQ",
      planning_year: 2026,
      harvest_year: 2026,
      years_planned: [],
      nvz:  "some",
      elevation: "some",
      use_mvp_fields: false,
      setup: false,
      fields_added: false,
      grass_setup: false,
      // livestock statuses
      // 1 Nothing added: null (incomplete)
      // 2 Copied from loading: copied (incomplete)
      // 3 Added for inventory: added (complete)
      livestock_loading: null,
      livestock_inventory: null,
      storage_added: false,
      rainwater_area_added: false,
      storage_figures: false,
      low_risk_land_added: null,
      area_added: false,
      manure_exports: false,
      manure_imports: false,
      manure_system: null,
      manure_system_details: false,
      wash_water: false,
      imports_exports: null,
      rainfall: 600,
      derogation: null,
      ewr: null,
    print : function () {
      console.log(this);
    },
    basic_setup : function () {
      this.setup = true,
      this.fields_added = true,
      console.log('Farm setup complete')
    }
  }


let fieldOne = {field_name: "Long Field", field_id: 1, nvz: true, elevation: false};
let fieldTwo = {field_name: "Short Field", field_id: 2, nvz: true, elevation: false};

router.get(/end_to_end_setup_handler/, function (req, res) { 
    oaktree_farm.basic_setup()
    oaktree_farm.years_planned.push(2026)
    oaktree_farm.grass_setup = true
    req.session.data.oaktree_farm = oaktree_farm

    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2], 'grass', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'grass', [1,2], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let applicationOne = allFunctions.addFertiliserApplication_v2 (req.session.data.all_fields, req.session.data.cropGroups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.fertiliserApplications.push(applicationOne)
    
    res.redirect('start')
})

router.get(/onecrop_v5_setup_handler/, function (req, res) { 
    oaktree_farm.basic_setup()
    req.session.data.oaktree_farm = oaktree_farm

    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2,3,4,5], 'Wheat-Winter', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Wheat-Winter', [1,2,3,4,5], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)
    req.session.data.oaktree_farm.years_planned.push(2026)

    res.redirect('start')
})

//full setup
router.get(/plan_setup/, function (req, res) { 
    oaktree_farm.basic_setup()
    oaktree_farm.years_planned.push(2026)
    oaktree_farm.area_added = true
    oaktree_farm.livestock_loading = 2
    oaktree_farm.livestock_inventory = 2
    oaktree_farm.manure_system = 2
    oaktree_farm.manure_system_details = 2
    oaktree_farm.storage_added = true
    oaktree_farm.derogation = false
    oaktree_farm.manure_imports = true
    oaktree_farm.manure_exports = true
    oaktree_farm.imports_exports = 2
    oaktree_farm.storage_added = true

    req.session.data.oaktree_farm = oaktree_farm

    req.session.data.showinfo = false
    req.session.data.extra_features = true
    req.session.data.all_fields = req.session.data.field_list_data
    
    // livestock
    let livestock_list = [1,2,3,4,5]
    for (let x in livestock_list) {
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }
    
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Beans-Winter', [8, 12], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2026, 'Wheat-Winter', [1, 4, 5, 6, 7, 14], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2026, 'grass', [10, 11, 18, 19], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_3)

    // manure applications
    for (let y in req.session.data.manure_applications_data) {
        req.session.data.manureApplications.push(req.session.data.manure_applications_data[y])
    }

    // fertiliser applications
    for (let x in req.session.data.fertiliser_applications_data) {
        req.session.data.fertiliserApplications.push(req.session.data.fertiliser_applications_data[x])
    }

    res.redirect('start')
})

router.get(/start_setup_handler/, function (req, res) { 
    oaktree_farm.setup = false
    req.session.data.oaktree_farm = oaktree_farm

    res.redirect('start')
})

router.get(/farm_setup_handler/, function (req, res) { 
    oaktree_farm.setup = true
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.showinfo = false
    req.session.data.extra_features = true

    res.redirect('start')
})

//Farm and fields added - this
router.get(/end_to_end_field_handler/, function (req, res) { 
    oaktree_farm.basic_setup()
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)

    res.redirect('start')
})

//Farm fields livestock added
router.get(/end_to_end_livestock_handler/, function (req, res) { 
    oaktree_farm.basic_setup()
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    
    // Livestock
    let livestock_list = [0,1,2,3,4,5,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_nloading = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }

    req.session.data.oaktree_farm.livestock_loading = 3;

    res.redirect('start')
})

//Farm fields livestock added
router.get(/livestock_handler_inventory/, function (req, res) { 
    oaktree_farm.basic_setup()
    oaktree_farm.livestock_inventory = 3;
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    
    // Livestock
    let livestock_list = [0,1,2,3,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_inventory = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }
    
    res.redirect('start')
})

router.get(/manure_storage_setup_handler/, function (req, res) {     
    oaktree_farm.basic_setup()
    oaktree_farm.storage_added = true
    req.session.data.oaktree_farm = oaktree_farm

    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)

    res.redirect('start')
})

router.get(/exports_setup_handler/, function (req, res) { 
    oaktree_farm.basic_setup()
    oaktree_farm.imports_exports = 2
    oaktree_farm.storage_added = true
    oaktree_farm.storage_figures = true
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.showinfo = false
    req.session.data.all_fields.push(fieldOne)
    req.session.data.all_fields.push(fieldTwo)
    
    // livestock
    let livestock_list = [0,1,2,3,4,5,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_inventory = 4
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }

    req.session.data.oaktree_farm.livestock_inventory = 3;

    res.redirect('start')
})

router.get(/inventory_setup_handler/, function (req, res) {     
    oaktree_farm.basic_setup()
    oaktree_farm.years_planned.push(2026)
    oaktree_farm.area_added = true
    oaktree_farm.manure_imports = true
    oaktree_farm.manure_exports = true
    oaktree_farm.imports_exports = 2
    req.session.data.oaktree_farm = oaktree_farm

    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.field_list_data

    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Beans-Winter', [8, 12], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2026, 'Wheat-Winter', [1, 4, 5, 6, 7, 14], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2026, 'grass', [10, 11, 18, 19], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_3)

    for (let x in req.session.data.fertiliser_applications_data) {
      req.session.data.fertiliserApplications.push(req.session.data.fertiliser_applications_data[x])
    }
    for (let y in req.session.data.manure_applications_data) {
      req.session.data.manureApplications.push(req.session.data.manure_applications_data[y])
    }
    console.log(req.session.data.manureApplications)

    res.redirect('start')
})

module.exports = router