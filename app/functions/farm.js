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
livestock_loading,
livestock_inventory,
storage_added,
low_risk_land_added,
rainwater_area_added,
storage_figures,
area_added,
imports_exports,
manure_exports,
manure_imports,
manure_system,
wash_water,
wash_water_details,
manure_system_details,
rainfall,
derogation,
ewr

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
    this.livestock_loading = livestock_loading,
    this.livestock_inventory = livestock_inventory,
    this.storage_added = storage_added,
    this.low_risk_land_added = low_risk_land_added,
    this.rainwater_area_added = rainwater_area_added,
    this.storage_figures = storage_figures,
    this.area_added = area_added,
    this.manure_exports = manure_exports,
    this.manure_imports = manure_imports,
    this.manure_system = manure_system,
    this.wash_water = wash_water,
    this.wash_water_details = wash_water_details,
    this.manure_system_details = manure_system_details,
    this.imports_exports = imports_exports,
    this.rainfall = rainfall
    this.derogation = derogation,
    this.ewr = ewr
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
                this.livestock_loading + ", " +
                this.livestock_inventory + ", " +
                this.storage_added + ", " +
                this.rainwater_area_added + ", " +
                this.storage_figures + ", " +
                this.low_risk_land_added + ", " +
                this.area_added + ", " +
                this.manure_exports + ", " +
                this.manure_imports + ", " +
                this.manure_system + ", " +
                this.wash_water + ", " +
                this.wash_water_details + ", " +
                this.manure_system_details + ", " +
                this.imports_exports + ", " +
                this.rainfall + ", " +
                this.derogation + ", " +
                this.ewr)
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
    this.fields_added = false,
    this.livestock_loading = 'not_answered',
    this.livestock_inventory = 'not_answered',
    this.storage_added = false,
    this.rainwater_area_added = false,
    this.storage_figures = false,
    this.low_risk_land_added = false,
    this.area_added = false,
    this.manure_exports = false,
    this.manure_imports = false,
    this.manure_system = 'not_answered',
    this.manure_system_details = false
    this.wash_water = 'not_answered',
    this.wash_water_details = false
    this.imports_exports = 'not_answered',
    this.rainfall = 600,
    this.derogation = null,
    this.ewr = null
};

function createFarm() {
  return new Farm();
}

module.exports.createFarm = createFarm;