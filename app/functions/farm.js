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
livestock_added,
storage_added,
low_risk_land_added,
rainwater_area_added,
area_added,
manure_exports,
manure_imports,
imports_exports,
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
    this.livestock_added = livestock_added,
    this.storage_added = storage_added,
    this.low_risk_land_added = low_risk_land_added,
    this.rainwater_area_added = rainwater_area_added,
    this.area_added = area_added,
    this.manure_exports = manure_exports,
    this.manure_imports = manure_imports,
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
                this.livestock_added + ", " +
                this.storage_added + ", " +
                this.rainwater_area_added + ", " +
                this.low_risk_land_added + ", " +
                this.area_added + ", " +
                this.manure_exports + ", " +
                this.manure_imports + ", " +
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
    this.livestock_added = false,
    this.storage_added = false,
    this.rainwater_area_added = false,
    this.low_risk_land_added = false,
    this.area_added = false,
    this.manure_exports = false,
    this.manure_imports = false,
    this.imports_exports = 'not_answered',
    this.rainfall = 600,
    this.derogation = null,
    this.ewr = null
};

function createFarm() {
  return new Farm();
}

module.exports.createFarm = createFarm;