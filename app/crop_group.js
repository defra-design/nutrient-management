function CropGroup (
year,
firstCropReference,
secondCropReference,
thirdCropReference,
fourthCropReference,
firstCropFields,
secondCropFields,
thirdCropFields,
fourthCropFields,
firstCropSelected,
thirdCropSelected,
totalFields
) {
  this.year = year,
  this.firstCropReference = firstCropReference,
  this.secondCropReference = secondCropReference,
  this.thirdCropReference = thirdCropReference,
  this.fourthCropReference = fourthCropReference,
  this.firstCropFields = firstCropFields,
  this.secondCropFields = secondCropFields,
  this.thirdCropFields = thirdCropFields,
  this.fourthCropFields = fourthCropFields,
  this.firstCropSelected = firstCropSelected,
  this.thirdCropSelected = thirdCropSelected,
  this.totalFields = totalFields

}

CropGroup.prototype.reset = function () {
  this.year = null,
  this.firstCropReference = null,
  this.secondCropReference = null,
  this.thirdCropReference = null,
  this.fourthCropReference = null,
  this.firstCropFields = null,
  this.secondCropFields = null,
  this.thirdCropFields = null,
  this.fourthCropFields = null,
  this.firstCropSelected = null,
  this.thirdCropSelected = null
  this.totalFields = null
};

function createCropGroup() {
  return new CropGroup();
}

module.exports.createCropGroup = createCropGroup;