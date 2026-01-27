var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');
var callback_functions = require('./callbacks.js');

function startFarm(type) {
  let obj = {
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
  };
  if (type != null || type != undefined) {
    obj.setup = true;
    obj.fields_added = true;
    console.log('Farm setup complete')
  }
  if (type === "storage") {
    obj.storage_added = true
  }
  return obj;
}

function print_farm(farm, info) {
  if (info === null || info === undefined) {
    console.log(farm);
  } else {
      for (let key in farm) {
        if (key === info) {
          console.log(info + ' = ' + farm[key]);
        }
      }
  }
}

// #1 - no farm setup
router.get(/setup_handler_no_farm/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm()
    console.log(req.session.data.oaktree_farm.setup)
    res.redirect('start')
})

// #2 - Arable crop added
router.get(/setup_handler_one_crop/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('basic')
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.showinfo = false
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2,3,4,5], 'Wheat-Winter', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Wheat-Winter', [1,2,3,4,5], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)
    req.session.data.oaktree_farm.years_planned.push(2026)
    res.redirect('start')
})

// #3 - Manner estimate added
router.get(/setup_handler_manner/, function (req, res) {
    req.session.data.oaktree_farm = startFarm()
    req.session.data.showinfo = false
    let tempApplication = {date:'01/06/2026', manuretype: req.session.data.manure_type_livestock_data[12], rate: 30 }
    req.session.data.manner_applications.push(tempApplication)
    res.redirect('start')
})

// #4 - Grass plan added
router.get(/setup_handler_grass_added/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    req.session.data.oaktree_farm.years_planned.push(2026)
    req.session.data.oaktree_farm.grass_setup = true
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2], 'grass', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'grass', [1,2], req.session.data.all_fields)
    req.session.data.cropGroups.push(group_1)

    let applicationOne = allFunctions.addFertiliserApplication_v2 (req.session.data.all_fields, req.session.data.cropGroups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.fertiliserApplications.push(applicationOne)
    // print_farm(req.session.data.oaktree_farm, 'storage_added')
    res.redirect('start')
})

// #5 - Full setup - everything
router.get(/setup_handler_everything/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('storage')
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.showinfo = false
    req.session.data.oaktree_farm.years_planned.push(2026)
    req.session.data.oaktree_farm.area_added = true
    req.session.data.oaktree_farm.livestock_loading = 2
    req.session.data.oaktree_farm.livestock_inventory = 2
    req.session.data.oaktree_farm.manure_system = 2
    req.session.data.oaktree_farm.manure_system_details = 2
    req.session.data.oaktree_farm.derogation = false
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 2
    req.session.data.extra_features = true
    
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

    //manner
    let tempApplication = {ref: 0, date:'01/06/2026', manuretype: req.session.data.manure_type_livestock_data[12], rate: 30}
    req.session.data.manner_applications.push(tempApplication)
    res.redirect('start')
})

// #6 - Farm without fields
router.get(/setup_handler_farm_only/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm()
    req.session.data.showinfo = false
    req.session.data.oaktree_farm.setup = true
    req.session.data.extra_features = true
    res.redirect('start')
})

// #7- Farm and fields added
router.get(/setup_handler_two_fields/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    res.redirect('start')
})

// #8- Livestock added for manure farm limit
router.get(/setup_handler_livestock_nloading/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    
    let livestock_list = [0,1,2,3,4,5,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_nloading = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }

    req.session.data.oaktree_farm.livestock_loading = 3;
    res.redirect('start')
})

// #9 - Livestock added for inventory and storage
router.get(/setup_handler_livestock_inventory/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    req.session.data.oaktree_farm.livestock_inventory = 3;    
    
    // Livestock
    let livestock_list = [0,1,2,3,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_inventory = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }
    res.redirect('start')
})

// #10 - Livestock added for inventory and storage
router.get(/setup_handler_manure_storage/, function (req, res) {   
    req.session.data.oaktree_farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    res.redirect('start')
})

// #11 - Livestock added for inventory and storage
router.get(/setup_handler_livestock_storage/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.showinfo = false
    req.session.data.oaktree_farm.imports_exports = 2
    req.session.data.oaktree_farm.storage_figures = true
    
    // livestock
    let livestock_list = [0,1,2,3,4,5,24]
    for (let x in livestock_list) {
      req.session.data.livestock_type_data[livestock_list[x]].numbers_for_inventory = 4
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[livestock_list[x]])
    }

    req.session.data.oaktree_farm.livestock_inventory = 3;
    res.redirect('start')
})

// #12 - Livestock added for inventory and storage
router.get(/setup_handler_inventory_imports/, function (req, res) { 
    req.session.data.oaktree_farm = startFarm('basic')
    req.session.data.showinfo = false
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.oaktree_farm.years_planned.push(2026)
    req.session.data.oaktree_farm.area_added = true
    req.session.data.oaktree_farm.manure_imports = true
    req.session.data.oaktree_farm.manure_exports = true
    req.session.data.oaktree_farm.imports_exports = 2
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