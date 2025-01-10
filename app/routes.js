const  govukPrototypeKit = require('govuk-prototype-kit')
const  router = govukPrototypeKit.requests.setupRouter()


//2025
var betahouse = require('./data/betahouse_farm_details.json');
var betahouse_fields = require('./data/betahouse_field_list.json');
let betahouse_crop_groups = require('./data/betahouse_crop_groups.json');
// for (var field in betahouse.field_references) {
//   for (var fielddata in betahouse_fields) {
//     if (betahouse.field_references[field] == betahouse_fields[fielddata].reference) {
//       console.log(betahouse_fields[fielddata])
//     }
//   }
// }
//

function Farm (
name,
postcode,
planning_year,
nvz,
elevation,
organic_producer,
latest_update,
use_mvp_fields,
setup,
fields_added,
rainfall

) {
    this.name = name,
    this.postcode = postcode,
    this.planning_year = planning_year,
    this.nvz = nvz,
    this.elevation = elevation,
    this.organic_producer = organic_producer,
    this.latest_update = latest_update,
    this.use_mvp_fields = use_mvp_fields,
    this.setup = setup,
    this.fields_added = fields_added,
    this.rainfall = rainfall
  }

Farm.prototype.printFarm = function () {
  console.log(  this.name + ", " +
                this.postcode + ", " +
                this.planning_year + ", " +
                this.nvz + ", " +
                this.elevation + ", " +
                this.organic_producer + ", " +
                this.latest_update + ", " +
                this.use_mvp_fields + ", " +
                this.setup + ", " +
                this.fields_added + ", " +
                this.rainfall)
};

Farm.prototype.reset = function () {
    this.name = null,
    this.postcode = null,
    this.planning_year = 2023,
    this.nvz = false,
    this.elevation = false,
    this.organic_producer = false,
    this.latest_update = null,
    this.use_mvp_fields = false,
    this.setup = false,
    this.fields_added = false
    this.rainfall = 600
};

function createFarm() {
  return new Farm();
}


///////Misc
var content = require('./content.js').content;
var allFunctions = require('./functions/allFunctions.js');


///////Farm
var oaktree_farm = createFarm();
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
oaktree_farm.rainfall = 600;


///////fields
var  field_list_mvp = require('./data/field_list_mvp.json');
var all_fields = [];

var tempField = {
    name: "Short Field",
    reference: "shortfield",
    nvz: false,
    elevation: false
};

//applications
var  fertiliser_applications_list = require('./data/fertiliser_applications.json');
var  manure_applications_list = require('./data/manure_applications.json');

///////Plans
var  Plan = require('./functions/plan.js');
var plan_2023 = Plan.createPlan();
var plan_2024 = Plan.createPlan();


///////Crops
var  potato_details = require('./data/potatoes.json');
var  crop_types = require('./data/crops.json');

var  CropGroup = require('./functions/crop_group.js');
// version 5
// var cropGroupV5_1 = CropGroup.createCropGroup()
// cropGroupV5_1.reference = 1
// cropGroupV5_1.year = 2024
// cropGroupV5_1.fields = [11,12,13,14,15]
// cropGroupV5_1.crop_reference = 'Oilseed-Spring'
// cropGroupV5_1.variety = 'Aurelia'

///////Manures
var  manure_types_digestate = require('./data/manure_types_digestate.json');
var  manure_types_other = require('./data/manure_types_other.json');
var  manure_types_biosolid = require('./data/manure_types_biosolid.json');
var  manure_types_livestock = require('./data/manure_types_livestock.json');
var  manure_types_livestock_groups = require('./data/manure_types_livestock_groups.json');


var plan2024 = {
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

    //new
    req.session.data.fertiliser_applications_list = fertiliser_applications_list
    req.session.data.manure_applications_list = manure_applications_list


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

    //manures
    req.session.data.plan_2024.multipleManuresApplied = false
    req.session.data.plan_2024.singleManuresApplied = false
    req.session.data.manure_journey = null //multi or single
    req.session.data.manure_count = 0
    req.session.data.chosen_manure = 'Cattle Farmyard Manure (old)'
    // req.session.data.manure_delay = null

    req.session.data.secondcrop_journey = null //true for second crop

    //fertilisers
    req.session.data.plan_2024.multipleFertilisersApplied = false
    req.session.data.plan_2024.singleFertilisersApplied = false
    req.session.data.fertiliser_journey = null //multi or single
    req.session.data.fertiliser_count = 0
    req.session.data.show_fertiliser_notification = false
    ///

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
    ///

    req.session.data.prototype_version = 'mvp'

    // new fields management
    req.session.data.all_fields = all_fields

    // version 5
    req.session.data.cropGroupsV5 = []
    req.session.data.allManureApplications = []
    req.session.data.allManureApplications_v2 = []
    req.session.data.allFertiliserApplications = []

    // notifications
    betahousesuccessMessage = null

    //planviews
    req.session.data.plan_version = 2

    //2025
    req.session.data.betahouse = betahouse
    req.session.data.betahouse_crop_groups = betahouse_crop_groups
    req.session.data.betahouse_fields = betahouse_fields
    

    req.session.data.new_variety = null

    req.session.data.chosen_farm = betahouse
    req.session.data.chosen_farm_crop_groups = betahouse_crop_groups
    req.session.data.chosen_farm_fields = betahouse_fields

    res.render('index')
})

//import routes
var  routes_prototype_setup = require('./router/routes_prototype_setup.js');
var  routes_alpha = require('./router/routes_alpha.js');
var  setup_routes = require('./router/setup_routes.js');
var  routes_six = require('./router/routes_version_6.js');

var  routes_farm = require('./router/routes_farm.js');
var  routes_field = require('./router/routes_field.js');
var  routes_crop = require('./router/routes_crop.js');
var  routes_updates = require('./router/routes_updates.js');
router.use('/', routes_farm, routes_field, routes_crop, routes_updates, routes_alpha, routes_six, setup_routes, routes_prototype_setup);
