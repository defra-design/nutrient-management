const  govukPrototypeKit = require('govuk-prototype-kit')
const  router = govukPrototypeKit.requests.setupRouter()

///external data
var  Plan = require('./functions/plan.js');

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
const  livestock_types = require('./data/livestock.json');

const allFunctions = require('./functions/allFunctions.js');
// const  CropGroup = require('./functions/crop_group.js');

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
router.get('/', function (req, res) { 
    req.session.data.oaktree_farm = {
        resetFarm : function () {
            req.session.data.oaktree_farm.created = true,
            req.session.data.oaktree_farm.name = "Oaktree Lane Farm",
            req.session.data.oaktree_farm.postcode = "NE46 7LQ",
            req.session.data.oaktree_farm.planning_year = 2025,
            req.session.data.oaktree_farm.nvz = "some",
            req.session.data.oaktree_farm.elevation = "some",
            req.session.data.oaktree_farm.organic_producer = false,
            req.session.data.oaktree_farm.latest_update = null,
            req.session.data.oaktree_farm.use_mvp_fields = false,
            req.session.data.oaktree_farm.setup = false,
            req.session.data.oaktree_farm.fields_added = false,
            req.session.data.oaktree_farm.livestock_loading = 'not_answered',
            req.session.data.oaktree_farm.livestock_inventory = 'not_answered',
            req.session.data.oaktree_farm.storage_added = false,
            req.session.data.oaktree_farm.rainwater_area_added = false,
            req.session.data.oaktree_farm.storage_figures = false,
            req.session.data.oaktree_farm.low_risk_land_added = false,
            req.session.data.oaktree_farm.area_added = false,
            req.session.data.oaktree_farm.manure_exports = false,
            req.session.data.oaktree_farm.manure_imports = false,
            req.session.data.oaktree_farm.manure_system = 'not_answered',
            req.session.data.oaktree_farm.manure_system_details = false,
            req.session.data.oaktree_farm.wash_water = 'not_answered',
            req.session.data.oaktree_farm.wash_water_details = false,
            req.session.data.oaktree_farm.imports_exports = 'not_answered',
            req.session.data.oaktree_farm.rainfall = 600,
            req.session.data.oaktree_farm.derogation = null,
            req.session.data.oaktree_farm.ewr = null,
            console.log('Farm is reset')
        },
        print : function () {
            console.log(this);
        }
    }

    req.session.data.oaktree_farm.resetFarm()
    req.session.data.oaktree_farm.print()

    // control vars  
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
    req.session.data.manner_applications = []
    req.session.data.extra_features = true
    req.session.data.imports_exports = null
    req.session.data.mech_separator = null

    //content
    req.session.data.manure_types_digestate = manure_types_digestate
    req.session.data.manure_types_other = manure_types_other
    req.session.data.manure_types_biosolid = manure_types_biosolid
    req.session.data.manure_types_livestock = manure_types_livestock
    req.session.data.manure_types_livestock_groups = manure_types_livestock_groups
    req.session.data.complete_field_list = complete_field_list
    req.session.data.potato_details = potato_details
    req.session.data.crop_types = crop_types
    req.session.data.livestock_types = livestock_types
    req.session.data.all_fertiliser_applications = all_fertiliser_applications
    req.session.data.manure_applications_list = manure_applications_list
    req.session.data.plan_2023 = plan_2023;
    req.session.data.plan_2024 = plan_2024;
    req.session.data.plan_2023.reset();
    req.session.data.plan_2024.reset();
    req.session.data.plan_2023.year = 2023;
    req.session.data.plan_2024.year = 2024;
    req.session.data.show_error = false;
    req.session.data.defoliations = "Cuts and grazings";

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

    // new fields management
    req.session.data.all_fields = all_fields

    // version 5
    req.session.data.currentCropGroups = []
    req.session.data.previousCropGroups = []
    req.session.data.allManureApplications = []
    req.session.data.allManureApplications_v2 = []
    req.session.data.allFertiliserApplications = []
    req.session.data.livestock_record_2025 = []

    //planviews
    req.session.data.plan_version = 2

    req.session.data.showinfo = true

    res.render('index')
})

//import routes
var  routes_prototype_setup = require('./router/routes_prototype_setup.js');
var  message_reset_handlers = require('./router/routes_message_reset_handlers.js');
var  setup_routes = require('./router/setup_routes.js');

var  routes_manure = require('./router/routes_manure.js');
var  reports_routes = require('./router/reports_routes.js');

var  routes_farm = require('./router/routes_farm.js');
var  routes_field = require('./router/routes_field.js');
var  routes_crop = require('./router/routes_crop.js');
var  routes_updates = require('./router/routes_updates.js');

var  livestock_storage_routes = require('./router/livestock_storage_routes.js');
var  manner_routes = require('./router/manner_routes.js');


router.use('/',routes_prototype_setup, message_reset_handlers, manner_routes, livestock_storage_routes, routes_farm, reports_routes, routes_field, routes_crop, routes_updates, routes_manure, setup_routes);