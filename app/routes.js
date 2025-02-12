const  govukPrototypeKit = require('govuk-prototype-kit')
const  router = govukPrototypeKit.requests.setupRouter()

///external data
const  all_fertiliser_applications = require('./data/fertiliser_applications.json');
const  manure_applications_list = require('./data/manure_applications.json');
const  complete_field_list = require('./data/complete_field_list.json');
const  manure_types_digestate = require('./data/manure_types_digestate.json');
const  manure_types_other = require('./data/manure_types_other.json');
const  manure_types_biosolid = require('./data/manure_types_biosolid.json');
const  manure_types_livestock = require('./data/manure_types_livestock.json');
const  manure_types_livestock_groups = require('./data/manure_types_livestock_groups.json');
const  potato_details = require('./data/potatoes.json');
const  crop_types = require('./data/crops.json');

const allFunctions = require('./functions/allFunctions.js');
const farm = require('./functions/farm.js');
const  CropGroup = require('./functions/crop_group.js');

const content = require('./content.js').content;
var  Plan = require('./functions/plan.js');

const loadContent = function (req, res, next) {
req.session.data.content = content
req.session.data.manure_types_digestate = manure_types_digestate
req.session.data.manure_types_other = manure_types_other
req.session.data.manure_types_biosolid = manure_types_biosolid
req.session.data.manure_types_livestock = manure_types_livestock
req.session.data.manure_types_livestock_groups = manure_types_livestock_groups
req.session.data.complete_field_list = complete_field_list
req.session.data.potato_details = potato_details
req.session.data.crop_types = crop_types
req.session.data.all_fertiliser_applications = all_fertiliser_applications
req.session.data.manure_applications_list = manure_applications_list
req.session.data.plan_2023 = plan_2023;
req.session.data.plan_2024 = plan_2024;
req.session.data.plan_2023.reset();
req.session.data.plan_2024.reset();
req.session.data.plan_2023.year = 2023;
req.session.data.plan_2024.year = 2024;
next()
}

const loadControlVars = function (req, res, next) {
    req.session.data.prototypeVersion = 'mvp'
    req.session.data.oaktree_farm = oaktree_farm
    req.session.data.tempField = tempField
    req.session.data.chosen_field = null
    req.session.data.crop_group = null
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
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0
    next()
}

/// create the farm
var oaktree_farm = farm.createFarm();

// populate the farm
oaktree_farm.name = 'Oaktree Lane Farm';
oaktree_farm.setup = false;

oaktree_farm.postcode = "NE46 7LQ";
oaktree_farm.planning_year = 2023;
oaktree_farm.nvz = "some";
oaktree_farm.elevation =  "some";
oaktree_farm.organic_producer = false;
oaktree_farm.latest_update = null;
oaktree_farm.use_mvp_fields = false;
oaktree_farm.fields_added = false;
oaktree_farm.plans_added = false;
oaktree_farm.rainfall = 600;
oaktree_farm.ewr = null;

/// create fields
let all_fields = [];

var tempField = {
    name: "Short Field",
    reference: "shortfield",
    // total_area: 10,
    // crop_area: 8,
    // non_spread_area: 2,
    nvz: false,
    elevation: false
    // soil: 'Medium',
    // sulphur: true,
    // analysis :false,
    // grass: true,
    // crop: 'winter-wheat',
    // sns: false
};

///////Plans
var plan_2023 = Plan.createPlan();
var plan_2024 = Plan.createPlan();

// ALPHA plan
const createAlphaPlan = (harvest_date, crop_added, manure_added, fertiliser_added) => ({
    harvest_date,
    crop_added,
    manure_added,
    fertiliser_added,
    plan_update: null,
    updated: '10 November 2023'
});

const alphaPlan2025 = createAlphaPlan("2025", false, false, false);
const alphaPlan2024 = createAlphaPlan("2024", true, true, true);
const alphaPlan2023 = createAlphaPlan("2023", false, false, false);

//index route
router.get('/', loadContent, loadControlVars, function (req, res) { 
    req.session.data.selected_fields = [{"reference":"1", "name":"Long Field", "planStatus":false, "crop": null, "soil": null},
    {"reference":"2", "name":"Barn Field", "planStatus":false, "crop": null, "soil": null},
    {"reference":"3", "name":"Orchard", "planStatus":false, "crop": null, "soil": null}]

    //set Alpha planning status
    req.session.data.alpha_planning = 0 //0 = not started, 1 = recs, 2 = completed
    
    //ALPHA plans
    req.session.data.alphaPlan2025 = alphaPlan2025
    req.session.data.alphaPlan2024 = alphaPlan2024
    req.session.data.alphaPlan2023 = alphaPlan2023

    //manures
    req.session.data.plan_2024.multipleManuresApplied = false
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'

    req.session.data.secondcrop_journey = null //true for second crop

    //fertilisers
    req.session.data.plan_2024.multipleFertilisersApplied = false
    req.session.data.plan_2024.singleFertilisersApplied = false
    req.session.data.fertiliser_journey = null //multi or single
    req.session.data.fertiliser_count = 0
    req.session.data.show_fertiliser_notification = false

    //grass
    req.session.data.defoliation_one = null
    req.session.data.defoliation_two = null
    req.session.data.defoliation_three = null
    req.session.data.defoliation_four = null
    req.session.data.defoliation_five = null
    req.session.data.defoliation_size = null
    req.session.data.weight_type = null
    req.session.data.grass_total_yield = null
    req.session.data.grass_total_yield_figure = null

    req.session.data.prototype_version = 'mvp'

    // new fields management
    req.session.data.all_fields = all_fields

    // version 5
    req.session.data.currentCropGroups = []
    req.session.data.previousCropGroups = []
    req.session.data.allManureApplications = []
    req.session.data.allManureApplications_v2 = []
    req.session.data.allFertiliserApplications = []

    //planviews
    req.session.data.plan_version = 2

    req.session.data.showinfo = true

    res.render('index')
})

//import routes
var  routes_prototype_setup = require('./router/routes_prototype_setup.js');
var  routes_manure = require('./router/routes_manure.js');
var  setup_routes = require('./router/setup_routes.js');
var  routes_six = require('./router/routes_version_6.js');

var  routes_farm = require('./router/routes_farm.js');
var  routes_field = require('./router/routes_field.js');
var  routes_crop = require('./router/routes_crop.js');
var  routes_updates = require('./router/routes_updates.js');
router.use('/', routes_farm, routes_field, routes_crop, routes_updates, routes_manure, routes_six, setup_routes, routes_prototype_setup);