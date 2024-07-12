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
soil_added,
fields_added,
plan_2023_added,
plan_2024_added

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
    this.soil_added = soil_added,
    this.fields_added = fields_added,
    this.plan_2023_added = plan_2023_added
    this.plan_2024_added = plan_2024_added
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
                this.soil_added + ", " +
                this.fields_added + ", " +
                this.plan_2023_added + ", " +
                this.plan_2024_added)
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
    this.soil_added = false,
    this.plan_2023_added = false,
    this.plan_2024_added = false,
    this.fields_added = false
};

function createFarm() {
  return new Farm();
}

module.exports.createFarm = createFarm;