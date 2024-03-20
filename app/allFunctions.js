function getFieldByReference (currentFarmFields, referenceNumber) {
    for (let field in currentFarmFields) {
      if (currentFarmFields[field].reference == referenceNumber) {
          console.log(currentFarmFields[field])
          return currentFarmFields[field]
      }
    }
  };

module.exports.getFieldByReference = getFieldByReference;