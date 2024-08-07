function getFieldByReference (currentFarmFields, referenceNumber) {
    for (let field in currentFarmFields) {
      if (currentFarmFields[field].reference == referenceNumber) {
          return currentFarmFields[field]
      }
    }
  };

function getMultipleFieldsByReferences (referenceNumbers, currentFields) {
    for (let x in referenceNumbers) {
        for (let y in currentFields) {
            if (currentFields[y].reference == referenceNumbers[x]) {
                // console.log(currentFields[y].name +  ' ' + referenceNumbers[x] )
                referenceNumbers[x] = currentFields[y]
            }
        }
    }
    return referenceNumbers
};

function totalFieldsCount(plan) {
    let totalFields = 0;
    if (plan.firstCropFields != undefined) {
        let totalFields = plan.firstCropFields.length
    }
    if (plan.thirdCropFields) {
        totalFields = totalFields + plan.thirdCropFields.length;
    }
    // console.log('total fields' + totalFields);
    return totalFields
}

function basicSetup (farm, mvpFields, manure, fertiliser) {
    farm.setup = true
    farm.soil_added = true
    farm.fields_added = true
    farm.use_mvp_fields = mvpFields
};

// allFunctions.farmSetup(req.session.data.oaktree_farm, req.session.data.plan_2023, req.session.data.plan_2024, fertilisers)
function farmSetup (farm, plan2023, plan2024, stage) {
    farm.setup = true
    if (stage == "fields" || stage == "crops" || stage == "grass" || stage == "manures" || stage == "fertilisers") {
        farm.fields_added = true
        plan2023.setup = true
    }
    if (stage == "crops" || stage == "grass" || stage == "manures" || stage == "fertilisers") {
        plan2024.setup = true
    }
    if (stage == "manures" || stage == "fertilisers") {
        plan2024.multipleManuresApplied = true
    }
    if (stage == "fertilisers") {
        plan2024.multipleFertilisersApplied = true
    }
};


function getCropByReference (referenceNumber, crops) {
    let cropToReturn
    for (let crop in crops) {
        if (crops[crop].reference == referenceNumber ) {
            console.log(cropToReturn.name)
            cropToReturn = crops[crop]
        }
    }
    return cropToReturn
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
module.exports.getMultipleFieldsByReferences = getMultipleFieldsByReferences;
module.exports.totalFieldsCount = totalFieldsCount;
module.exports.basicSetup = basicSetup;
module.exports.farmSetup = farmSetup;