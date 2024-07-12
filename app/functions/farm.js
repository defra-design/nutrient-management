function Farm (
name,
postcode,
planning_year,
nvz,
elevation,
organic_producer,
latest_update,
planFour,
planFive,
use_mvp_fields,
setup,
soil_added,
fields_added,
plans_added
) {
    this.name = name,
    this.postcode = postcode,
    this.planning_year = planning_year,
    this.nvz = nvz,
    this.elevation = elevation,
    this.organic_producer = organic_producer,
    this.latest_update = latest_update,
    this.planFour = planFour,
    this.planFive = planFive,
    this.use_mvp_fields = use_mvp_fields,
    this.setup = setup,
    this.soil_added = soil_added,
    this.fields_added = fields_added,
    this.plans_added = plans_added
  }

Farm.prototype.printFarm = function () {
  console.log(  this.name + ", " +
                this.postcode + ", " +
                this.planning_year + ", " +
                this.nvz + ", " +
                this.elevation + ", " +
                this.organic_producer + ", " +
                this.latest_update + ", " +
                this.planFour + ", " +
                this.planFive + ", " +
                this.use_mvp_fields + ", " +
                this.setup + ", " +
                this.soil_added + ", " +
                this.fields_added + ", " +
                this.plans_added)
};

Farm.prototype.reset = function () {
    this.name = null,
    this.postcode = null,
    this.planning_year = 2023,
    this.nvz = false,
    this.elevation = false,
    this.organic_producer = false,
    this.latest_update = null,
    this.planFour = false,
    this.planFive = false,
    this.use_mvp_fields = false,
    this.setup = false,
    this.soil_added = false,
    this.fields_added = false
};

Farm.prototype.checkPlans = function () {
    if (this.planFour = true || this.planFive == true) {
        return true
    } else {
        return false
    }
};

function createFarm() {
  return new Farm();
}

module.exports.createFarm = createFarm;