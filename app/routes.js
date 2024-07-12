const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

//import data
const farm_details = require('./data/farm_details.json');
const field_details = require('./data/field_details.json');
const field_details_v2 = require('./data/field_details_v2.json');
const field_details_mvp = require('./data/field_details_mvp.json');
const potato_details = require('./data/potatoes.json');
const crop_types = require('./data/crops.json');
const content = require('./content.js').content;
const allFunctions = require('./functions/allFunctions.js');
const manure_types_digestate = require('./data/manure_types_digestate.json');
const manure_types_other = require('./data/manure_types_other.json');
const manure_types_biosolid = require('./data/manure_types_biosolid.json');
const manure_types_livestock = require('./data/manure_types_livestock.json');
const manure_types_livestock_groups = require('./data/manure_types_livestock_groups.json');

const Farm = require('./functions/farm.js');
const oaktree_farm = Farm.createFarm();
oaktree_farm.name = 'Oaktree Lane Farm';
oaktree_farm.postcode = "NE46 7LQ";
oaktree_farm.nvz = "some";
oaktree_farm.elevation =  "some";
oaktree_farm.organic_producer = false;
oaktree_farm.latest_update = null;
oaktree_farm.planFour = false;
oaktree_farm.planFive = false;
oaktree_farm.use_mvp_fields = false;
oaktree_farm.setup = false;
oaktree_farm.soil_added = false;
oaktree_farm.fields_added = false;
oaktree_farm.plans_added = false;

const CropGroup = require('./functions/crop_group.js');
//crop group with 1 main crop
let crop_group_one = CropGroup.createCropGroup();
crop_group_one.year = '2025';
crop_group_one.firstCropReference = 'Wheat-Winter';
crop_group_one.firstCropVariety = 'Crusoe';
crop_group_one.secondCropReference = 'Turnips-stubble';
crop_group_one.thirdCropReference = null
crop_group_one.fourthCropReference = null
crop_group_one.firstCropFields = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
crop_group_one.secondCropFields = ['1', '2', '3', '4', '5'];
crop_group_one.thirdCropFields = [];
crop_group_one.fourthCropFields = [];
crop_group_one.firstCropSelected = true;
crop_group_one.thirdCropSelected = false;
crop_group_one.totalFields = allFunctions.totalFieldsCount(crop_group_one);

//crop group with 2 main crops
let crop_group_two = CropGroup.createCropGroup();
crop_group_two.year = '2024';
crop_group_two.firstCropReference = 'Wheat-Winter';
crop_group_two.secondCropReference = 'Turnips-stubble';
crop_group_two.thirdCropReference = 'rye-Winter';
crop_group_two.thirdCropVariety = 'Boyko';
crop_group_two.fourthCropReference = 'Turnips-stubble';
crop_group_two.firstCropFields = ['1', '2', '3', '4'];
// crop_group_two.secondCropFields = ['1', '2', '3'];
crop_group_two.thirdCropFields = ['5', '6', '7', '8'];
// crop_group_two.fourthCropFields = ['5', '6'];
crop_group_two.firstCropSelected = true
crop_group_two.thirdCropSelected = true
crop_group_two.totalFields = allFunctions.totalFieldsCount(crop_group_two);

let crop_group_three = CropGroup.createCropGroup();
crop_group_three.year = '2024';
crop_group_three.firstCropReference = 'Wheat-Winter';
crop_group_three.secondCropReference = null;
crop_group_three.thirdCropReference = 'rye-Winter';
crop_group_three.thirdCropVariety = 'Boyko';
crop_group_three.fourthCropReference = null;
crop_group_three.firstCropFields = ['1', '2', '3', '4'];
// crop_group_three.secondCropFields = ['1', '2', '3'];
crop_group_three.thirdCropFields = ['5', '6', '7', '8'];
// crop_group_three.fourthCropFields = ['5', '6'];
crop_group_three.firstCropSelected = true
crop_group_three.thirdCropSelected = true
crop_group_three.totalFields = allFunctions.totalFieldsCount(crop_group_three);

let crop_group_2023 = CropGroup.createCropGroup();
let crop_group_2024 = CropGroup.createCropGroup();

// var testy = allFunctions.getFieldByReference(field_details_mvp, 9);
// console.log(testy);


const Plan = require('./functions/plan.js');
let plan_2023 = Plan.createPlan();
let plan_2024 = Plan.createPlan();

//new fields management
let farmFields2023 = [];
let farmFields2024 = [];

// console.log(farmFields[0])

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
    req.session.data.prototypeVersion = 'mvp'
    //content variables
    req.session.data.content = content

    //create oaktree farm
    req.session.data.oaktree_farm = oaktree_farm
    // req.session.data.oaktree_farm.printFarm()
    
    //create 2025 crop plan
    req.session.data.crop_group_one = crop_group_one
    req.session.data.crop_group_two = crop_group_two
    req.session.data.crop_group_three = crop_group_three
    req.session.data.crop_group_2024 = crop_group_2024
    req.session.data.crop_group_2023 = crop_group_2023
    // req.session.data.crop_group_two.printCropGroup();

    //data
    req.session.data.manure_types_digestate = manure_types_digestate
    req.session.data.manure_types_other = manure_types_other
    req.session.data.manure_types_biosolid = manure_types_biosolid
    req.session.data.manure_types_livestock = manure_types_livestock
    req.session.data.manure_types_livestock_groups = manure_types_livestock_groups
    
    req.session.data.field_details = field_details
    req.session.data.field_details_v2 = field_details_v2
    req.session.data.field_details_mvp = field_details_mvp
    req.session.data.potato_details = potato_details
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
    // req.session.data.fieldsToShow = []
    // req.session.data.secondFieldsInThisPlan = []
    // req.session.data.thirdFieldsInThisPlan = []
    // req.session.data.fourthFieldsInThisPlan = []

    req.session.data.crop_group_2024.firstCropFields = []
    req.session.data.crop_group_2024.secondCropFields = []
    req.session.data.crop_group_2024.thirdCropFields = []
    req.session.data.crop_group_2024.fourthCropFields = []

    req.session.data.crop_group_2023.firstCropFields = []
    req.session.data.crop_group_2023.secondCropFields = []
    req.session.data.crop_group_2023.thirdCropFields = []
    req.session.data.crop_group_2023.fourthCropFields = []
    req.session.data.cover_fields = []

    //manures - temp remove
    req.session.data.multi_manures = false
    req.session.data.single_manures = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    // req.session.data.manure_delay = null
    req.session.data.show_manure_notification = false
    
    //fertilisers - temp remove
    req.session.data.multi_fertiliser = false
    req.session.data.single_fertiliser = false
    req.session.data.fertiliser_journey = null //multi or single
    req.session.data.fertiliser_count = 0
    req.session.data.show_fertiliser_notification = false

    req.session.data.prototype_version = 'mvp'

    // new fields management
    req.session.data.farmFields2023 = farmFields2023;
    req.session.data.farmFields2024 = farmFields2024;

    req.session.data.farmFields2023.push({
        name: "Jon's Field",
        reference: 1,
        cropReference: 1,
        secondCropReference: null,
        multiManure: false,
        singleManure: false,
        multiFertiliser: false,
        singleFertiliser: false
    });

    req.session.data.farmFields2023.push({
        name: "Jack's Field",
        reference: 2,
        cropReference: 2,
        secondCropReference: null,
        multiManure: false,
        singleManure: false,
        multiFertiliser: false,
        singleFertiliser: false
    });

    // console.log(req.session.data.farmFields2023)

    res.render('index')
})

//import routes
const routes_main = require('./router/routes_mvp.js');
const routes_alpha = require('./router/routes_alpha.js');
router.use('/', routes_main, routes_alpha);
