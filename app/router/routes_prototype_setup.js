var express = require('express')
var router = express.Router()
var allFunctions = require('../functions/allFunctions.js');


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
    livestock_nloading_status: null,
    livestock_msreq_status: null,
    //new
    area_added: null,
    rain_water_area_added: null,
    imports_exports_status: null,
    manure_stores_status: null,
    storage_figures: false,
    low_risk_land_added: null,
    manure_exports: false,
    manure_imports: false,
    manure_system: null,
    manure_system_details: false,
    wash_water: false,
    rainfall: 600,
    derogation: null,
    ewr: null,
  };
  if (type != null) {
    obj.setup = true;
    obj.fields_added = true;
    console.log('Farm setup complete')
  }
  if (type === "storage") {
    obj.manure_stores_added = true
  }
  return obj;
}

// #1 - no farm setup
router.get(/setup_handler_no_farm/, function (req, res) {
    req.session.data.farm = startFarm()
    console.log(req.session.data.farm.setup)
    res.redirect('start')
})

// #2 - Arable crop added
router.get(/setup_handler_one_crop/, function (req, res) {
    req.session.data.farm = startFarm('basic')
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.show_info = false
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2,3,4,5], 'Wheat-Winter', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Wheat-Winter', [1,2,3,4,5])
    req.session.data.planned_crop_groups.push(group_1)
    req.session.data.farm.years_planned.push(2026)
    res.redirect('start')
})

// #3 - Manner estimate added
router.get(/setup_handler_manner/, function (req, res) {
    req.session.data.farm = startFarm()
    req.session.data.show_info = false
    let tempApplication = {ref: 1, date:'01/06/2026', manuretype: req.session.data.manure_type_livestock_data[12], rate: 30 }
    req.session.data.manner_applications.push(tempApplication)
    res.redirect('start')
})

// #4 - Grass plan added
router.get(/setup_handler_grass_added/, function (req, res) {
    req.session.data.farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.show_info = false
    req.session.data.farm.years_planned.push(2026)
    req.session.data.farm.grass_setup = true
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1,2], 'grass', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'grass', [1,2])
    req.session.data.planned_crop_groups.push(group_1)
    let applicationOne = allFunctions.addFertiliserApplication(req.session.data.all_fields, req.session.data.planned_crop_groups, 1, '01/03/2024', 60, 30, 30, 0, 0, 1)
    req.session.data.fertiliser_applications.push(applicationOne)
    res.redirect('start')
})

// #5 - Full setup - everything
router.get(/setup_handler_everything/, function (req, res) {
    req.session.data.farm = startFarm('storage')
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.show_info = false
    req.session.data.farm.years_planned.push(2026)
    req.session.data.farm.area_added = true
    req.session.data.farm.livestock_nloading_status = 'ADDED_FOR_N_LOADING'
    req.session.data.farm.manure_system = 2
    req.session.data.farm.manure_system_details = 2
    req.session.data.farm.derogation = false
    req.session.data.farm.manure_imports = true
    req.session.data.farm.manure_exports = true
    req.session.data.farm.imports_exports_status = 'IMPORT_AND_EXPORT_ADDED'
    req.session.data.extra_features = true

    // livestock
    const livestock_list = [1,2,3,4,5]
    livestock_list.forEach(x => {
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[x])
    })

    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Beans-Winter', [8, 12])
    req.session.data.planned_crop_groups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2026, 'Wheat-Winter', [1, 4, 5, 6, 7, 14])
    req.session.data.planned_crop_groups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2026, 'grass', [10, 11, 18, 19])
    req.session.data.planned_crop_groups.push(group_3)

    // manure applications
    req.session.data.manure_applications_data.forEach(app => {
      req.session.data.manure_applications.push(app)
    })

    // fertiliser applications
    req.session.data.fertiliser_applications_data.forEach(app => {
      req.session.data.fertiliser_applications.push(app)
    })

    //manner
    let tempApplication = {ref: 1, date:'01/06/2026', manuretype: req.session.data.manure_type_livestock_data[12], rate: 30}
    req.session.data.manner_applications.push(tempApplication)
    res.redirect('start')
})

// #6 - Farm without fields
router.get(/setup_handler_farm_only/, function (req, res) {
    req.session.data.farm = startFarm()
    req.session.data.show_info = false
    req.session.data.farm.setup = true
    req.session.data.extra_features = true
    res.redirect('start')
})

// #7 - Farm and fields added
router.get(/setup_handler_two_fields/, function (req, res) {
    req.session.data.farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.show_info = false
    res.redirect('start')
})

// #8 - Livestock added for manure farm limit
router.get(/setup_handler_livestock_nloading/, function (req, res) {
    req.session.data.farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.show_info = false

    const livestock_list = [0,1,2,3,4,5,24]
    livestock_list.forEach(x => {
      req.session.data.livestock_type_data[x].numbers_for_nloading = 2
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[x])
    })

    req.session.data.farm.livestock_nloading_status = 'ADDED_FOR_N_LOADING';
    res.redirect('start')
})


// #10 - Livestock added for inventory and storage
router.get(/setup_handler_manure_storage/, function (req, res) {
    req.session.data.farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.show_info = false
    res.redirect('start')
})

// #11 - Livestock added for inventory and storage
router.get(/setup_handler_livestock_storage/, function (req, res) {
    req.session.data.farm = startFarm('storage')
    req.session.data.all_fields = [req.session.data.field_list_data[0], req.session.data.field_list_data[16]]
    req.session.data.show_info = false
    req.session.data.farm.imports_exports_status = 'EXPORT_ADDED'
    req.session.data.farm.storage_figures = true

    // livestock
    const livestock_list = [0,1,2,3,4,5,24]
    livestock_list.forEach(x => {
      req.session.data.livestock_type_data[x].numbers_for_inventory = 4
      req.session.data.livestock_record_plan_year.push(req.session.data.livestock_type_data[x])
    })

    res.redirect('start')
})

// #12 - Livestock added for inventory and storage
router.get(/setup_handler_inventory_imports/, function (req, res) {
    req.session.data.farm = startFarm('basic')
    req.session.data.show_info = false
    req.session.data.all_fields = req.session.data.field_list_data
    req.session.data.farm.years_planned.push(2026)
    req.session.data.farm.area_added = true
    req.session.data.farm.manure_imports = true
    req.session.data.farm.imports_exports_status = 'IMPORT_ADDED'
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [8, 12], 'Beans-Winter', 1)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 4, 5, 6, 7, 14], 'Wheat-Winter', 2)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [10, 11, 18, 19], 'grass', 3)

    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Beans-Winter', [8, 12])
    req.session.data.planned_crop_groups.push(group_1)

    let group_2 = allFunctions.createCropGroup(null, 2, 2026, 'Wheat-Winter', [1, 4, 5, 6, 7, 14])
    req.session.data.planned_crop_groups.push(group_2)

    let group_3 = allFunctions.createCropGroup(null, 3, 2026, 'grass', [10, 11, 18, 19])
    req.session.data.planned_crop_groups.push(group_3)

    req.session.data.fertiliser_applications_data.forEach(app => {
      req.session.data.fertiliser_applications.push(app)
    })

    req.session.data.manure_applications_data.forEach(app => {
      req.session.data.manure_applications.push(app)
    })

    res.redirect('start')
})

// #14 - Manure NVZ breach
router.get(/setup_handler_manure_added_too_high/, function (req, res) {
    req.session.data.farm = startFarm('basic')
    req.session.data.all_fields = [req.session.data.field_list_data[1], req.session.data.field_list_data[16]]
    req.session.data.show_info = false
    req.session.data.farm.years_planned.push(2026)
    req.session.data.all_fields = allFunctions.setCropAndGroupId(req.session.data.all_fields, [1, 16], 'Beans-Winter', 1)
    let group_1 = allFunctions.createCropGroup(null, 1, 2026, 'Beans-Winter', [1, 16])
    req.session.data.planned_crop_groups.push(group_1)
    req.session.data.manure_applications.push(req.session.data.manure_applications_data[0])
    res.redirect('start')
})


module.exports = router
module.exports.startFarm = startFarm
