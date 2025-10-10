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
const  livestock_types = require('./data/livestock.json');

const allFunctions = require('./functions/allFunctions.js');

/// create fields
let all_fields = [];

var temp_field = {
    field_name: "Short Field",
    field_id: 1,
    nvz: false,
    elevation: false
};

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
            req.session.data.oaktree_farm.use_mvp_fields = false,
            req.session.data.oaktree_farm.setup = false,
            req.session.data.oaktree_farm.fields_added = false,
            req.session.data.oaktree_farm.grass_setup = false,
            // livestock statuses
            // 1 Nothing added = null (incomplete)
            // 2 Copied from loading = copied (incomplete)
            // 3 Added for inventory = added (complete)
            req.session.data.oaktree_farm.livestock_loading = null,
            req.session.data.oaktree_farm.livestock_inventory = null,
            req.session.data.oaktree_farm.storage_added = false,
            req.session.data.oaktree_farm.rainwater_area_added = false,
            req.session.data.oaktree_farm.storage_figures = false,
            req.session.data.oaktree_farm.low_risk_land_added = null,
            req.session.data.oaktree_farm.area_added = false,
            req.session.data.oaktree_farm.manure_exports = false,
            req.session.data.oaktree_farm.manure_imports = false,
            req.session.data.oaktree_farm.manure_system = null,
            req.session.data.oaktree_farm.manure_system_details = false,
            req.session.data.oaktree_farm.wash_water = false,
            req.session.data.oaktree_farm.imports_exports = null,
            req.session.data.oaktree_farm.rainfall = 600,
            req.session.data.oaktree_farm.derogation = null,
            req.session.data.oaktree_farm.ewr = null
        },
        print : function () {
            console.log(this);
        }
    }

    req.session.data.oaktree_farm.resetFarm()
    // req.session.data.oaktree_farm.print()

    // control vars  
    req.session.data.show_success_message = false
    req.session.data.temp_field = temp_field
    console.log(req.session.data.temp_field)
    req.session.data.chosen_field = null
    req.session.data.crop_group = null
    req.session.data.chosen_crop = null
    req.session.data.chosen_fields = []
    req.session.data.another_crop = 'no'
    req.session.data.chosen_plan = null //v2
    req.session.data.crop_count = 0
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0
    req.session.data.manner_applications = []
    req.session.data.extra_features = true
    req.session.data.imports_exports = null
    req.session.data.livestock_update_journey = false
    req.session.data.wash_area_name = 'Washed area 1'
    

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
    req.session.data.show_error = false;
    req.session.data.defoliations = "Cuts and grazings";

    req.session.data.selected_fields = [{"reference":"1", "name":"Long Field",  "crop": null, "soil": null},
    {"reference":"2", "name":"Barn Field",  "crop": null, "soil": null},
    {"reference":"3", "name":"Orchard",  "crop": null, "soil": null}]

    //set Alpha planning status
    req.session.data.alpha_planning = 0 //0 = not started, 1 = recs, 2 = completed
    
    //manures
    req.session.data.multipleManuresApplied = false
    req.session.data.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'

    req.session.data.secondcrop_journey = null //true for second crop

    //fertilisers
    req.session.data.multipleFertilisersApplied = false
    req.session.data.singleFertilisersApplied = false
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
    req.session.data.cropGroups = []
    req.session.data.manureGroups = []
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
var  routes_for_journeys = require('./router/routes_for_journeys.js');

var  reports_routes = require('./router/reports_routes.js');


var  manner_routes = require('./router/manner_routes.js');

router.use('/',routes_prototype_setup, message_reset_handlers, routes_for_journeys, manner_routes, reports_routes);