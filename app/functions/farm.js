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
exports_added,
rainfall,
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
    this.exports_added = exports_added,
    this.rainfall = rainfall
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
                this.exports_added + ", " +
                this.rainfall + ", " +
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
    this.fields_added = false
    this.livestock_added = false
    this.exports_added = false
    this.rainfall = 600
    this.ewr = null
};

function createFarm() {
  return new Farm();
}

module.exports.createFarm = createFarm;