function Plan (
year,
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
multipleManuresApplied
) {
    this.year = year,
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
    this.multipleManuresApplied = multipleManuresApplied
  }

Plan.prototype.printPlan = function () {
  console.log(
    "Plan Year = " + this.year + " ",
    "First fields references = " + this.firstFieldReferences + " ",
    "Second fields references = " + this.secondFieldReferences + " ",
    "Third fields references = " + this.thirdFieldReferences + " ",
    "First Crop Reference = " + this.firstCropReference + " ",
    "Second Crop Reference = " + this.secondCropReference + " ",
    "Third Crop Reference = " + this.thirdCropReference + " ",
    "Single manures = " + this.singleManuresApplied + " ",
    "Multi manures = " + this.multipleManuresApplied + " "
  )
};

Plan.prototype.reset = function () {
  this.year = null,
  this.firstFieldReferences = null,
  this.secondFieldReferences = null,
  this.thirdFieldReferences = null,
  this.firstFields = null,
  this.secondFields = null,
  this.thirdFields = null,
  this.firstCropReference = null,
  this.secondCropReference = null,
  this.thirdCropReference = null,
  this.singleManuresApplied = null
  this.multipleManuresApplied = null
};

function createPlan() {
  return new Plan();
};

module.exports.createPlan = createPlan;