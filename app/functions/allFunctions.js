function field_count(field_references) {
    return field_references.length;
  }

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
function farmSetup (farm, alphaPlan2023, alphaPlan2024, stage) {
    farm.setup = true
    if (stage == "fields" || stage == "crops" || stage == "grass" || stage == "manures" || stage == "fertilisers") {
        farm.fields_added = true
        alphaPlan2023.setup = true
    }
    if (stage == "crops" || stage == "grass" || stage == "manures" || stage == "fertilisers") {
        alphaPlan2024.setup = true
    }
    if (stage == "manures" || stage == "fertilisers") {
        alphaPlan2024.multipleManuresApplied = true
    }
    if (stage == "fertilisers") {
        alphaPlan2024.multipleFertilisersApplied = true
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

function createCropGroup (reference, year, field_references, current_fields, crop_reference, variety, group, yield, date, sns) {
    var newGroup = {
        reference: reference,
        year: year,
        fields: getMultipleFieldsByReferences(field_references, current_fields),
        crop_reference: crop_reference,
        variety: variety, 
        groupname: group,
        yield: yield,
        planting_date: date,
        sns: sns
    }
    return newGroup
}

function createLivestockItem (reference, amount) {
    var newItem = {
        reference: reference,
        amount: amount
    }
    return newItem
}

function addManureApplication (fertiliserGroups, cropGroups, chosenFields, organic, manure_type, application_date) {
    let field_count = 0
    let cropgroupreferences = []
    if (chosenFields == 'all') {
        for (var group in cropGroups) {
            cropgroupreferences.push(cropGroups[group].reference)
            field_count = field_count + cropGroups[group].fields.length
        }
    } else {
        for (var x in chosenFields) {
            cropgroupreferences.push(chosenFields[x])
            field_count = field_count + cropGroups[x].fields.length
        }
    }
    var newGroup = {
        reference: fertiliserGroups.length + 1,
        crop_group_references: cropgroupreferences,
        field_count: field_count,
        organic: organic,
        manure_type: manure_type,
        application_date: application_date
    }
    return newGroup
}

function addManureApplication_v2 (allFields, cropGroups, fieldReference, manureDate, manureType) {
    let fieldName = null
    let crop_reference = null
    for (var x in allFields) {
        if (allFields[x].reference == fieldReference) {
            fieldName = allFields[x].name
            fieldName = allFields[x].name
        }
    }
    for (var y in cropGroups) {
        for (var z in cropGroups[y].fields) {
            if (cropGroups[y].fields[z].reference == fieldReference ) {
                crop_reference = cropGroups[y].crop_reference
            }
        }
    }
    var newApplication = {
        "Field": fieldName,
        "fieldref": fieldReference,
        "Crop": crop_reference,
        "date": manureDate,
        "type": manureType,
        "rate": "20",
        "method": "Discharge spreader",
        "incorporation": "Mouldboard plough",
        "Delay": "12-24 hours",
        "drainage": "3/31/24",
        "Rainfall": "357",
        "DM": "25",
        "Total N": "6",
        "NH4-N": "0.5",
        "Uric acid N": "0",
        "NO3-N": "0.1",
        "P2O5": "3.2",
        "K2O": "8",
        "MgO": "1.8",
        "SO3": "2.4"
    }
    return newApplication
}

function convertNutrient (nutrient) {
    if (nutrient == null || nutrient == '') {
        nutrient = 0
    }
    return nutrient
}

function showSucess (message) {
    req.session.data.show_success_message = true
    req.session.data.successMessage = 3
}


function addFertiliserApplication_v2 (allFields, cropGroups, fieldReference, fertiliserDate, nitrogen, phosphate, potash, sulphur, lime, ref) {
    let fieldName = null
    let crop_reference = null
    nitrogen = convertNutrient(nitrogen)
    phosphate = convertNutrient(phosphate)
    potash = convertNutrient(potash)
    sulphur = convertNutrient(sulphur)
    lime = convertNutrient(lime)
    for (var x in allFields) {
        if (allFields[x].reference == fieldReference) {
            fieldName = allFields[x].name
        }
    }
    for (var y in cropGroups) {
        for (var z in cropGroups[y].fields) {
            if (cropGroups[y].fields[z].reference == fieldReference ) {
                crop_reference = cropGroups[y].crop_reference
            }
        }
    }
    var newApplication = {
        "field": fieldName,
        "fieldref": fieldReference,
        "crop": crop_reference,
        "date": fertiliserDate,
        "analysis": "0:20:20:0:0:0",
        "rate": "280",
        "nitrogen": nitrogen,
        "P2O5": phosphate,
        "K2O": potash,
        "MgO": "0",
        "SO3": sulphur,
        "Na2O": "0",
        "Lime": lime,
        "ref": ref
    }
    return newApplication
}


function addFertiliserApplication (fertiliserGroups, allFields, chosenFields, nutrients, rate, application_date) {
    let fieldObjects = []
    for (fieldObject in allFields) {
        for (field in chosenFields) {
            if (allFields[fieldObject].reference == chosenFields[field]) {
                
                fieldObjects.push(allFields[fieldObject])
            }
        }
    }
    var newGroup = {
        reference: fertiliserGroups.length + 1,
        chosenFields: fieldObjects,
        nutrients: nutrients,
        rate: rate,
        application_date: application_date
    }
    return newGroup
}

function getCropByReference (referenceNumber, crops) {
    let cropToReturn
    for (let crop in crops) {
        if (crops[crop].reference == referenceNumber ) {
            cropToReturn = crops[crop]
        }
    }
    return cropToReturn
};

function getManureFields(chosenFields) {
    let fieldsToReturn = null
    if (chosenFields == 'all') {
        fieldsToReturn = [1,2,3,4,5,6,7,8,9,10]
    } else {
        fieldsToReturn = [1,2,3,4,5]
    }
    return fieldsToReturn
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
module.exports.getManureFields = getManureFields;
module.exports.addManureApplication = addManureApplication;
module.exports.addFertiliserApplication = addFertiliserApplication;
module.exports.addManureApplication_v2 = addManureApplication_v2;
module.exports.addFertiliserApplication_v2 = addFertiliserApplication_v2;
module.exports.createLivestockItem = createLivestockItem;

module.exports.field_count = field_count;