function field_count(field_references) {
  return field_references.length;
}

function getFieldByReference (allFields, referenceNumber) {
  for (let field in allFields) {
    if (allFields[field].field_id == referenceNumber) {
        return allFields[field]
    }
  }
};

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

function getByReference (types, referenceValue) {
  for (let x in types ) {
    if (types[x].name == referenceValue || types[x].reference == referenceValue) {
      return types[x]
    }
  }
};

function setCropAndGroupId (all_fields, chosenFields, chosenCrop, chosenGroup) {
  for (let x in all_fields) {
    for (let y in chosenFields) {
      if (all_fields[x].field_id == chosenFields[y]) {
          all_fields[x].crop_id = chosenCrop
          all_fields[x].group_id = chosenGroup
      }
    }
  }
  return all_fields
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

function createCropGroup(group_name, group_id, year, crop_id, field_list, current_fields) {
  var newGroup = {
    group_name: group_name,
    group_id: group_id,
    year: year,
    crop_id: crop_id,
    field_list: field_list,
  }
  // console.log('create group = ' + field_list)
  return newGroup
}

function createStorage(store_type, store_name, store_material) {
  var newGroup = {
    store_type: store_type,
    store_name: store_name,
    store_material: store_material
  }
  return newGroup
}

//set field name
function setFieldName(temp_field, temp_field_name, fields_length) {
temp_field.field_id = fields_length + 1
  if (temp_field_name == "" || temp_field_name == null) {
    temp_field.field_name = 'New Field #' + temp_field.field_id;
  } else {
    temp_field.field_name = temp_field_name;
  }
  return temp_field;
}

//set field sizes
function setFieldSizes(temp_field, total_area, cropped_area, non_spreading_area) {
  if (total_area != '' && total_area != null) {
    temp_field.total_area = total_area;
  }
  if (cropped_area != '' && cropped_area != null) {
    temp_field.cropped_area = cropped_area;
  }
  if (non_spreading_area != '' && non_spreading_area != null) {
    temp_field.non_spreading_area = non_spreading_area;
  }
  return temp_field;
}

// req.session.data.all_fields = allFunctions.updateFieldCrop(req.session.data.all_fields, field_list, crop_id, year, variety, group_id)
function updateFieldCrop(all_fields, field_list, crop_id, year, variety, group_id) {
  for ( var x in field_list) {
    for ( var y in all_fields) {
      if (field_list[x] == all_fields[y].field_id) {
        all_fields[y].crop_id = crop_id
        all_fields[y].variety = variety
        all_fields[y].group_id = group_id
      }
    }
  }
  return all_fields
}

function createLivestockItem (reference, amount) {
  let newItem = {
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

// let applicationGroup = allFunctions.add_manure_application (group_id, year, req.session.data.all_fields, req.session.data.cropGroups, field_list[x], application_date, manure_id)
function add_manure_application (group_id, year, field_id, application_date, manure_id) {
  let crop_id = null
  var newApplication = {
    "group_id": group_id,
    "year": year,
    "field_id": field_id,
    "application_date": application_date,
    "manure_id": manure_id,
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

function addFertiliserApplication_v2 (group_id, year, field_id, date, nitrogen, phosphate, potash, sulphur, lime) {
  nitrogen = convertNutrient(nitrogen)
  phosphate = convertNutrient(phosphate)
  potash = convertNutrient(potash)
  sulphur = convertNutrient(sulphur)
  lime = convertNutrient(lime)
  var newApplication = {
    "group_id": group_id,
    "year": year,
    "field_id": field_id,
    "date": date,
    "analysis": "0:20:20:0:0:0",
    "rate": "280",
    "nitrogen": nitrogen,
    "P2O5": phosphate,
    "K2O": potash,
    "MgO": "0",
    "SO3": sulphur,
    "Na2O": "0",
    "Lime": lime,
  }
  console.log(newApplication)
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

// function createCropGroup (reference, year, field_references, current_fields, crop_reference, variety, group, yield, date, sns) {
//     var newGroup = {
//         reference: reference,
//         year: year,
//         fields: getMultipleFieldsByReferences(field_references, current_fields),
//         crop_reference: crop_reference,
//         variety: variety, 
//         groupname: group,
//         yield: yield,
//         planting_date: date,
//         sns: sns
//     }
//     return newGroup
// }

module.exports.printCropGroup = printCropGroup;
module.exports.getFieldByReference = getFieldByReference;
module.exports.getMultipleFieldsByReferences = getMultipleFieldsByReferences;
module.exports.totalFieldsCount = totalFieldsCount;
module.exports.basicSetup = basicSetup;
module.exports.createCropGroup = createCropGroup;
module.exports.getManureFields = getManureFields;
module.exports.addManureApplication = addManureApplication;
module.exports.addFertiliserApplication = addFertiliserApplication;
module.exports.add_manure_application = add_manure_application;
module.exports.addFertiliserApplication_v2 = addFertiliserApplication_v2;
module.exports.createLivestockItem = createLivestockItem;
module.exports.field_count = field_count;
module.exports.updateFieldCrop = updateFieldCrop;
module.exports.setCropAndGroupId = setCropAndGroupId;
module.exports.createStorage = createStorage;
module.exports.setFieldName = setFieldName;
module.exports.setFieldSizes = setFieldSizes;
module.exports.getByReference = getByReference;