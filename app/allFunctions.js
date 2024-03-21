function getFieldByReference (currentFarmFields, referenceNumber) {
    for (let field in currentFarmFields) {
      if (currentFarmFields[field].reference == referenceNumber) {
          // console.log(currentFarmFields[field])
          return currentFarmFields[field]
      }
    }
  };

 function printCropGroup(group) {
    console.log(  'group' +
                  group.year + ", " +
                  group.firstCropReference + ", " +
                  group.secondCropReference + ", " +
                  group.thirdCropReference + ", " +
                  group.fourthCropReference + ", " +
                  group.firstCropFields + ", " +
                  group.secondCropFields + ", " +
                  group.thirdCropFields + ", " +
                  group.fourthCropFields)
  };

module.exports.printCropGroup = printCropGroup;
module.exports.getFieldByReference = getFieldByReference;