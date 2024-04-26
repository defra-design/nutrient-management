function CropGroup (
year,
firstCropReference,
firstCropVariety,
secondCropReference,
secondCropVariety,
thirdCropReference,
thirdCropVariety,
fourthCropReference,
fourthCropVariety,
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
  this.firstCropVariety = firstCropVariety,
  this.secondCropReference = secondCropReference,
  this.secondCropVariety = secondCropVariety,
  this.thirdCropReference = thirdCropReference,
  this.thirdCropVariety = thirdCropVariety,
  this.fourthCropReference = fourthCropReference,
  this.fourthCropVariety = fourthCropVariety,
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
  this.firstCropVariety = null,
  this.secondCropReference = null,
  this.secondCropVariety = null,
  this.thirdCropReference = null,
  this.thirdCropVariety = null,
  this.fourthCropReference = null,
  this.fourthCropVariety = null,
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