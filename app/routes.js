const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

//import data
const farm_details = require('./data/farm_details.json');
const field_details = require('./data/field_details.json');
const field_details_v2 = require('./data/field_details_v2.json');
const field_details_mvp = require('./data/field_details_mvp.json');
const crop_types = require('./data/crops.json');
const content = require('./content.js').content;

const Farm = require('./farm.js');
const oaktree_farm = Farm.createFarm();
oaktree_farm.name = 'Oaktree Lane Farm';
oaktree_farm.postcode = "NE46 7LQ";
oaktree_farm.nvz = "some";
oaktree_farm.elevation =  "some";
oaktree_farm.rganic_producer = false;
oaktree_farm.latest_update = null;
oaktree_farm.planFour = false;
oaktree_farm.planFive = false;
oaktree_farm.use_mvp_fields = false;
oaktree_farm.setup = false;
oaktree_farm.soil_added = false;
oaktree_farm.fields_added = false;
oaktree_farm.plans_added = false;

const CropGroup = require('./crop_group.js');
//crop group with 1 main crop
let crop_group_one = CropGroup.createCropGroup();
crop_group_one.year = '2025';
crop_group_one.firstCropReference = 'Wheat-Winter';
crop_group_one.secondCropReference = 'Turnips-stubble';
crop_group_one.thirdCropReference = null
crop_group_one.fourthCropReference = null
crop_group_one.firstCropFields = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
crop_group_one.secondCropFields = ['1', '2', '3', '4', '5'];
crop_group_one.thirdCropFields = [];
crop_group_one.fourthCropFields = [];
crop_group_one.firstCropSelected = true
crop_group_one.thirdCropSelected = false

//crop group with 2 main crops selected
let crop_group_populated = CropGroup.createCropGroup();
crop_group_populated.year = '2025';
crop_group_populated.firstCropReference = 'Wheat-Winter';
crop_group_populated.secondCropReference = 'Turnips-stubble';
crop_group_populated.thirdCropReference = 'rye-Winter';
crop_group_populated.fourthCropReference = 'Turnips-stubble';
crop_group_populated.firstCropFields = ['1', '2', '3', '4'];
crop_group_populated.secondCropFields = ['1', '2', '3'];
crop_group_populated.thirdCropFields = ['5', '6', '7', '8'];
crop_group_populated.fourthCropFields = ['5', '6'];
crop_group_populated.firstCropSelected = true
crop_group_populated.thirdCropSelected = true

let crop_group_2025 = CropGroup.createCropGroup();

const allFunctions = require('./allFunctions.js');

// var testy = allFunctions.getFieldByReference(field_details_mvp, 9);
// console.log(testy);

let currentFieldGroup = [];

let tempField = {
    name: "Short Field",
    reference: "shortfield",
    nvz: false,
    elevation: false,
    area: 0,
    manure: 0,
    cropped: 0,
    type: null
};

let current_fields = [];

let plan2025 = {
    harvest_date: "2025",
    crop_added: false,
    manure_added: false,
    fertiliser_added: false,
    plan_update: 'crop_added',
    updated: 'getFieldByReference' 
};

let plan2024 = {
    harvest_date: "2024",
    crop_added: true,
    manure_added: true,
    fertiliser_added: true,
    plan_update: null,
    updated: '10 November 2023' 
};

//index route, loads data in application
router.get('/', function (req, res) { 
    //content variables
    req.session.data.content = content

    //create oaktree farm
    req.session.data.oaktree_farm = oaktree_farm
    // req.session.data.oaktree_farm.printFarm()
    
    //create 2025 crop plan
    req.session.data.crop_group_one = crop_group_one
    req.session.data.crop_group_populated = crop_group_populated
    req.session.data.crop_group_2025 = crop_group_2025
    // req.session.data.crop_group_populated.printCropGroup();

    //data
    req.session.data.field_details = field_details
    req.session.data.field_details_v2 = field_details_v2
    req.session.data.field_details_mvp = field_details_mvp
    req.session.data.crop_types = crop_types
    req.session.data.farm_details = farm_details
    req.session.data.chosenfield = null
    req.session.data.crop_group = null
    req.session.data.current_fields = current_fields
    req.session.data.tempField = tempField

    //plan functionality
    req.session.data.plan2024 = plan2024
    req.session.data.plan2025 = plan2025
    req.session.data.chosen_plan = plan2024

    req.session.data.selected_fields = [{"reference":"1", "name":"Long Field", "planStatus":false, "crop": null, "soil": null},
    {"reference":"2", "name":"Barn Field", "planStatus":false, "crop": null, "soil": null},
    {"reference":"3", "name":"Orchard", "planStatus":false, "crop": null, "soil": null}]

    //control vars
    req.session.data.chosen_nutrients = []
    req.session.data.chosen_nitrogen = false
    req.session.data.chosen_phosphate = false
    req.session.data.chosen_potash = false
    req.session.data.chosen_sulphur = false
    req.session.data.chosen_lime = false
    req.session.data.chosen_crop = null
    req.session.data.chosen_fields = []
    req.session.data.plan_type = 'new'
    req.session.data.another_crop = 'no'
    req.session.data.chosen_plan = null //v2
    req.session.data.show_success_message = false
    req.session.data.crop_count = 0

    // route vars
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0

    // reset the fields shown in the plan
    req.session.data.fieldsToShow = []
    req.session.data.secondFieldsInThisPlan = []
    req.session.data.thirdFieldsInThisPlan = []
    req.session.data.fourthFieldsInThisPlan = []

    res.render('index')
    
})

//import routes
const main_routes = require('./main_routes.js');
const alpha_routes = require('./alpha_routes.js');
router.use('/', main_routes, alpha_routes);
