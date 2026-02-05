const  govukPrototypeKit = require('govuk-prototype-kit')
const  router = govukPrototypeKit.requests.setupRouter()

///external data

const  fertiliser_applications_data = require('./data/fertiliser_applications.json');
const  manure_applications_data = require('./data/manure_applications.json');
const  field_list_data = require('./data/field_list.json');
const  manure_type_digestate_data = require('./data/manure_type_digestate.json');
const  manure_type_other_data = require('./data/manure_type_other.json');
const  manure_type_biosolid_data = require('./data/manure_type_biosolid.json');
const  manure_type_livestock_data = require('./data/manure_type_livestock.json');
const  manure_type_livestock_groups_data = require('./data/manure_type_livestock_groups.json');
const  potato_details_data = require('./data/potato_types.json');
const  crop_types_data = require('./data/crop_types.json');
const  livestock_type_data = require('./data/livestock_types.json');

const allFunctions = require('./functions/allFunctions.js');

/// create fields
let all_fields = [];

let temp_field = {
    field_name: "Short Field",
    total_area: '19',
    cropped_area:'17',
    non_spreading_area: '2',
    soil_type: 'Medium',
    field_id: 1,
    field_nvz: true,
    field_alt: false,
    soil_analysis: true
};

//index route
router.get('/', function (req, res) { 

    // control vars  
    req.session.data.show_success_message = false
    req.session.data.temp_field = temp_field
    req.session.data.chosen_field = null
    req.session.data.crop_group = null
    req.session.data.chosen_crop = null
    req.session.data.chosen_fields = []
    req.session.data.another_crop = 'no'
    req.session.data.chosen_plan = null //v2
    req.session.data.crop_count = 0
    req.session.data.manure_spreads = 0
    req.session.data.fertiliser_spreads = 0
    // req.session.data.manner_setup = false
    req.session.data.manner_applications = []
    req.session.data.extra_features = true
    req.session.data.imports_exports = null
    req.session.data.livestock_update_journey = false
    req.session.data.wash_area_name = 'Washed area 1'
    req.session.data.example_date = "27 3 2026"
    req.session.data.update_date = "22 September 2025"
    
    //content
    req.session.data.manure_type_digestate_data = manure_type_digestate_data
    req.session.data.manure_type_other_data = manure_type_other_data
    req.session.data.manure_type_biosolid_data = manure_type_biosolid_data
    req.session.data.manure_type_livestock_data = manure_type_livestock_data
    req.session.data.manure_type_livestock_groups_data = manure_type_livestock_groups_data
    req.session.data.field_list_data = field_list_data
    req.session.data.potato_details_data = potato_details_data
    req.session.data.crop_types_data = crop_types_data
    req.session.data.livestock_type_data = livestock_type_data
    req.session.data.fertiliser_applications_data = fertiliser_applications_data
    req.session.data.manure_applications_data = manure_applications_data
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
    req.session.data.chosen_manure_fields = []

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

    // new fields management
    req.session.data.all_fields = all_fields

    // version 5
    req.session.data.cropGroups = []
    req.session.data.manure_storage = []
    req.session.data.manureApplications = []
    req.session.data.fertiliserApplications = []
    req.session.data.livestock_record_plan_year = []

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
var  manure_inventory_routes = require('./router/manure_inventory_routes.js');
var  manner_routes = require('./router/manner_routes.js');

router.use('/',routes_prototype_setup, message_reset_handlers, routes_for_journeys, manner_routes, reports_routes, manure_inventory_routes);