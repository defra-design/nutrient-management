const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

///////Misc
const content = require('./content.js').content;
const allFunctions = require('./functions/allFunctions.js');


///////Farm
const Farm = require('./functions/farm.js');
const oaktree_farm = Farm.createFarm();
// populate farm
oaktree_farm.name = 'Oaktree Lane Farm';
oaktree_farm.postcode = "NE46 7LQ";
oaktree_farm.planning_year = 2023;
oaktree_farm.nvz = "some";
oaktree_farm.elevation =  "some";
oaktree_farm.organic_producer = false;
oaktree_farm.latest_update = null;
oaktree_farm.use_mvp_fields = false;
oaktree_farm.setup = false;
oaktree_farm.fields_added = false;
oaktree_farm.plans_added = false;


///////fields
const field_list_mvp = require('./data/field_list_mvp.json');
let all_fields = [];

let tempField = {
    name: "Short Field",
    reference: "shortfield",
    nvz: false,
    elevation: false
};

///////Plans
const Plan = require('./functions/plan.js');
let plan_2023 = Plan.createPlan();
let plan_2024 = Plan.createPlan();


///////Crops
const potato_details = require('./data/potatoes.json');
const crop_types = require('./data/crops.json');

const CropGroup = require('./functions/crop_group.js');
let crop_group_one = CropGroup.createCropGroup();
let crop_group_two = CropGroup.createCropGroup();
let crop_group_three = CropGroup.createCropGroup();
let crop_group_2023 = CropGroup.createCropGroup();
let crop_group_2024 = CropGroup.createCropGroup();
//crop group with 1 main crop
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


///////Manures
const manure_types_digestate = require('./data/manure_types_digestate.json');
const manure_types_other = require('./data/manure_types_other.json');
const manure_types_biosolid = require('./data/manure_types_biosolid.json');
const manure_types_livestock = require('./data/manure_types_livestock.json');
const manure_types_livestock_groups = require('./data/manure_types_livestock_groups.json');


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
    req.session.data.content = content
    req.session.data.prototypeVersion = 'mvp'

    //create oaktree farm
    req.session.data.oaktree_farm = oaktree_farm
    
    req.session.data.tempField = tempField

    //data
    req.session.data.manure_types_digestate = manure_types_digestate
    req.session.data.manure_types_other = manure_types_other
    req.session.data.manure_types_biosolid = manure_types_biosolid
    req.session.data.manure_types_livestock = manure_types_livestock
    req.session.data.manure_types_livestock_groups = manure_types_livestock_groups
    req.session.data.field_list_mvp = field_list_mvp
    req.session.data.potato_details = potato_details
    req.session.data.crop_types = crop_types
    req.session.data.chosen_field = null
    req.session.data.crop_group = null


    //plans
    req.session.data.plan_2023 = plan_2023;
    req.session.data.plan_2024 = plan_2024;
    req.session.data.plan_2023.reset();
    req.session.data.plan_2024.reset();
    req.session.data.plan_2023.year = 2023;
    req.session.data.plan_2024.year = 2024;


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

    //manures - temp remove
    req.session.data.plan_2024.multipleManuresApplied = false
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    // req.session.data.manure_delay = null
    req.session.data.show_manure_notification = false

    req.session.data.secondcrop_journey = null //true for second crop

    
    //fertilisers - temp remove
    req.session.data.plan_2024.multipleFertilisersApplied = false
    req.session.data.plan_2024.singleFertilisersApplied = false
    req.session.data.fertiliser_journey = null //multi or single
    req.session.data.fertiliser_count = 0
    req.session.data.show_fertiliser_notification = false

    req.session.data.prototype_version = 'mvp'

    // new fields management
    req.session.data.all_fields = all_fields

    res.render('index')
})

//import routes
const routes_prototype_setup = require('./router/routes_prototype_setup.js');
const routes_alpha = require('./router/routes_alpha.js');
const routes_mvp = require('./router/routes_mvp.js');
// router.use('/', routes_mvp, routes_alpha, routes_prototype_setup);
router.use('/', routes_alpha, routes_mvp, routes_prototype_setup);
