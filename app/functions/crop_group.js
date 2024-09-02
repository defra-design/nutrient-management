function CropGroup (
  reference,
  year,
  fields,
  crop_reference,
  variety
) {
  this.reference = reference,
  this.year = year,
  this.fields = fields,
  this.crop_reference = crop_reference,
  this.variety = variety
}

CropGroup.prototype.reset = function () {
  reference = null,
  year = null,
  fields = [],
  crop_reference = null,
  variety = null
};

function createCropGroup() {
  return new CropGroup();
}

module.exports.createCropGroup = createCropGroup;