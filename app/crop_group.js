function CropGroup (
year,
firstCropReference,
secondCropReference,
firstCropFields,
secondCropFields
) {
  this.year = year,
  this.firstCropReference = firstCropReference,
  this.secondCropReference = secondCropReference,
  this.firstCropFields = firstCropFields,
  this.secondCropFields = secondCropFields
}

CropGroup.prototype.printCropGroup = function () {
  console.log(  this.year + ", " +
                this.firstCropReference + ", " +
                this.secondCropReference + ", " +
                this.firstCropFields + ", " +
                this.secondCropFields)
};

CropGroup.prototype.reset = function () {
  this.year = null,
  this.firstCropReference = null,
  this.secondCropReference = null,
  this.firstCropFields = null,
  this.secondCropFields = null
};

CropGroup.prototype.getFieldByReference = function (currentFarmFields, referenceNumber) {
  for (var field in currentFarmFields) {
    if (currentFarmFields[field].reference == referenceNumber) {
        console.log(currentFarmFields[field])
        return currentFarmFields[field]
    }
  }
};


function createCropGroup() {
  return new CropGroup();
}

module.exports.createCropGroup = createCropGroup;