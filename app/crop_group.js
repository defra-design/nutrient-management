function CropGroup (
year,
firstCropReference,
secondCropReference,
thirdCropReference,
fourthCropReference,
firstCropFields,
secondCropFields,
thirdCropFields,
fourthCropFields
) {
  this.year = year,
  this.firstCropReference = firstCropReference,
  this.secondCropReference = secondCropReference,
  this.thirdCropReference = thirdCropReference,
  this.fourthCropReference = fourthCropReference,
  this.firstCropFields = firstCropFields,
  this.secondCropFields = secondCropFields,
  this.thirdCropFields = thirdCropFields,
  this.fourthCropFields = fourthCropFields

}

CropGroup.prototype.reset = function () {
  this.year = null,
  this.firstCropReference = null,
  this.secondCropReference = null,
  this.thirdCropReference = null,
  this.fourthCropReference = null,
  this.firstCropFields = null,
  this.secondCropFields = null
  this.thirdCropFields = null
  this.fourthCropFields = null
};

function createCropGroup() {
  return new CropGroup();
}

module.exports.createCropGroup = createCropGroup;