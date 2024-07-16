function Plan (
year,
setup,
firstFieldReferences,
secondFieldReferences,
thirdFieldReferences,
firstFields,
secondFields,
thirdFields,
firstCropReference,
secondCropReference,
thirdCropReference,
singleManuresApplied,
multipleManuresApplied,
multipleFertilisersApplied,
singleFertilisersApplied,
totalFields
) {
    this.year = year,
    this.setup = setup,
    this.firstFieldReferences = firstFieldReferences
    this.secondFieldReferences = secondFieldReferences
    this.thirdFieldReferences = thirdFieldReferences
    this.firstFields = firstFields
    this.secondFields = secondFields
    this.thirdFields = thirdFields
    this.firstCropReference = firstCropReference,
    this.secondCropReference = secondCropReference,
    this.thirdCropReference = thirdCropReference,
    this.singleManuresApplied = singleManuresApplied,
    this.multipleManuresApplied = multipleManuresApplied,
    this.multipleFertilisersApplied = multipleFertilisersApplied,
    this.singleFertilisersApplied = singleFertilisersApplied,
    this.totalFields = totalFields
  }

Plan.prototype.printPlan = function () {
  console.log(
    "Plan Year = " + this.year + " ",
    "Plan setup = " + this.setup + " ",
    "First fields references = " + this.firstFieldReferences + " ",
    "Second fields references = " + this.secondFieldReferences + " ",
    "Third fields references = " + this.thirdFieldReferences + " ",
    "First Crop Reference = " + this.firstCropReference + " ",
    "Second Crop Reference = " + this.secondCropReference + " ",
    "Third Crop Reference = " + this.thirdCropReference + " ",
    "Single manures = " + this.singleManuresApplied + " ",
    "Multi manures = " + this.multipleManuresApplied + " ",
    "Single fertilisers = " + this.singleFertilisersApplied + " ",
    "Multi fertilisers = " + this.multipleFertilisersApplied + " ",
    "total Fields = " + this.totalFields + " "
  )
};

Plan.prototype.reset = function () {
  this.year = null,
  this.setup = null,
  this.firstFieldReferences = [],
  this.secondFieldReferences = [],
  this.thirdFieldReferences = [],
  this.firstFields = [],
  this.secondFields = [],
  this.thirdFields = [],
  this.firstCropReference = null,
  this.secondCropReference = null,
  this.thirdCropReference = null,
  this.singleManuresApplied = null
  this.multipleManuresApplied = null,
  this.singleFertilisersApplied = null,
  this.multipleFertilisersApplied = null,
  this.totalFields = null
};

function createPlan() {
  return new Plan();
};

module.exports.createPlan = createPlan;