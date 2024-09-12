function getFieldByReference (currentFarmFields, referenceNumber) {
    for (let field in currentFarmFields) {
      if (currentFarmFields[field].reference == referenceNumber) {
          return currentFarmFields[field]
      }
    }
  };

  function getGroupByReference (currentGroups, referenceNumber) {
    for (let group in currentGroups) {
      if (currentGroups[group].reference == referenceNumber) {
          return currentGroups[group]
      }
    }
  };


//   function getFieldByReference (currentFarmFields, referenceNumber) {
//     for (let field in currentFarmFields) {
//       if (currentFarmFields[field].reference == referenceNumber) {
//           return currentFarmFields[field]
//       }
//     }
//   };

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

function cropSetup (planYear, cropOne, cropTwo, firstFields, secondFields) {
    planYear.firstCropReference = cropOne
    planYear.secondCropReference = cropTwo
    planYear.firstFieldReferences = firstFields
    planYear.secondFieldReferences = secondFields
};

function manureSetup (planYear, multipleManures, singleManures, multipleFertilisers, singleFertilisers) {
    planYear.multipleManuresApplied = multipleManures 
    planYear.singleManuresApplied = singleManures
    planYear.multipleFertilisersApplied = multipleFertilisers 
    planYear.singleFertilisersApplied = singleFertilisers
};

function createCropGroup (reference, year, field_references, current_fields, crop_reference, variety, group) {
    var newGroup = {
        reference: reference,
        year: year,
        fields: getMultipleFieldsByReferences(field_references, current_fields),
        crop_reference: crop_reference,
        variety: variety, 
        groupname: group
    }
    return newGroup
}

function createApplicationGroup (reference, year, field_references, current_fields, organic, manure_type, single_application, application_date) {
    var newGroup = {
        reference: reference,
        year: year,
        fields: field_references,
        organic: organic,
        manure_type: manure_type,
        single_application: single_application,
        application_date: application_date
    }
    return newGroup
}

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

function getManureFields() {
    return  [1,2,3,4,5]
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
module.exports.getGroupByReference = getGroupByReference;
module.exports.getMultipleFieldsByReferences = getMultipleFieldsByReferences;
module.exports.totalFieldsCount = totalFieldsCount;
module.exports.basicSetup = basicSetup;
module.exports.farmSetup = farmSetup;
module.exports.cropSetup = cropSetup;
module.exports.manureSetup = manureSetup;
module.exports.createCropGroup = createCropGroup;
module.exports.createApplicationGroup = createApplicationGroup;
module.exports.getManureFields = getManureFields;
