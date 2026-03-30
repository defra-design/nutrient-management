// =============================================================================
// ALL FUNCTIONS
// Utility functions used across the route files. Grouped by what they work on:
// fields, crops, manures, fertilisers, livestock, storage, and lookup helpers.
// =============================================================================


// -------------------------
// LOOKUP HELPERS
// General-purpose functions for finding an item inside an array.
// -------------------------

// Returns the first item in `types` whose `name` or `reference` matches `referenceValue`.
// Used to resolve a selected value (e.g. a manure type name) into its full data object.
// Example: getByReference(manure_type_livestock_data, 'cattle-fym') → { name: 'Cattle FYM', ... }
function getByReference (types, referenceValue) {
  for (let x in types ) {
    if (types[x].name == referenceValue || types[x].reference == referenceValue) {
      return types[x]
    }
  }
}

// Returns the first item in `types` whose `name` matches `referenceName`.
// Similar to getByReference but only checks the name property.
// Example: getByName(manure_types, 'Cattle FYM') → { name: 'Cattle FYM', ... }
function getByName (types, referenceName) {
  for (var x in types ) {
      if (types[x].name == referenceName) {
          return types[x]
      }
  }
}


// -------------------------
// FIELDS
// Functions for finding, creating, and updating field objects.
// -------------------------

// Returns a single field from `allFields` whose `field_id` matches `referenceNumber`.
// Example: getFieldByReference(all_fields, 3) → { field_id: 3, field_name: 'Long Field', ... }
function getFieldByReference (allFields, referenceNumber) {
  for (let field in allFields) {
    if (allFields[field].field_id == referenceNumber) {
        return allFields[field]
    }
  }
}

// Takes an array of field ID numbers (`referenceNumbers`) and replaces each number
// with its full field object from `currentFields`.
// Returns the same array but with objects instead of IDs.
// Example: getMultipleFieldsByReferences([1, 3], all_fields) → [{ field_id:1, ... }, { field_id:3, ... }]
function getMultipleFieldsByReferences (referenceNumbers, currentFields) {
  for (let x in referenceNumbers) {
    for (let y in currentFields) {
      if (currentFields[y].reference == referenceNumbers[x]) {
          referenceNumbers[x] = currentFields[y]
      }
    }
  }
  return referenceNumbers
}

// Returns the number of fields in a `field_references` array.
// Simple wrapper around `.length`.
function field_count(field_references) {
  return field_references.length;
}

// Sets the `field_name` and `field_id` on a `temp_field` object.
// If `temp_field_name` is blank, generates a default name like "New Field #3".
// `fields_length` is the current number of fields — used to calculate the new field's ID.
// Returns the updated `temp_field`.
function setFieldName(temp_field, temp_field_name, fields_length) {
  temp_field.field_id = fields_length + 1
  if (temp_field_name == "" || temp_field_name == null) {
    temp_field.field_name = 'New Field #' + temp_field.field_id;
  } else {
    temp_field.field_name = temp_field_name;
  }
  return temp_field;
}

// Sets the area values on a `temp_field` object.
// Only updates a value if the new value is non-empty — preserves existing values otherwise.
// Returns the updated `temp_field`.
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


// -------------------------
// CROPS
// Functions for attaching crop information to fields and creating crop groups.
// A crop group is the link between a set of fields, a crop type, and a planning year.
// -------------------------

// Creates a new crop group object.
// `group_name` — display name (e.g. "Crop group 1")
// `group_id`   — unique number
// `year`       — planning year (e.g. 2026)
// `crop_id`    — crop reference string (e.g. 'Wheat-Winter')
// `field_list` — array of field IDs in this group
// Returns the new crop group object.
// Note: callers previously passed `all_fields` as a final argument but it was never used.
function createCropGroup(group_name, group_id, year, crop_id, field_list) {
  var newGroup = {
    group_name: group_name,
    group_id: group_id,
    year: year,
    crop_id: crop_id,
    field_list: field_list,
  }
  return newGroup
}

// Sets `crop_id` and `group_id` on every field in `all_fields` whose `field_id`
// appears in the `chosenFields` array.
// Returns the updated `all_fields` array.
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
}

// Updates crop details (`crop_id`, `variety`, `group_id`) on every field in `all_fields`
// whose `field_id` appears in `field_list`.
// Returns the updated `all_fields` array.
function updateFieldCrop(all_fields, field_list, crop_id, variety, group_id) {
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

// Returns the total number of fields across firstCropFields and thirdCropFields in a plan.
function totalFieldsCount(plan) {
  let totalFields = 0;
  if (plan.firstCropFields != undefined) {
    totalFields = plan.firstCropFields.length
  }
  if (plan.thirdCropFields) {
    totalFields = totalFields + plan.thirdCropFields.length;
  }
  return totalFields
}


// -------------------------
// MANURES
// Functions for creating organic manure application records.
// -------------------------

// Creates a single manure application object for a specific field.
// This is the current version used in the add-manure journey.
// `group_id`         — ID of the application group
// `year`             — planning year
// `field_id`         — the field this application is for
// `application_date` — date string (e.g. "21/02/2026")
// `manure_id`        — the manure type name
// Returns the new application object.
function add_manure_application (group_id, year, field_id, application_date, manure_id) {
  var newApplication = {
    "group_id": group_id,
    "year": year,
    "field_id": field_id,
    "application_date": application_date,
    "manure_id": manure_id,
    "rate": "20"
  }
  return newApplication
}

// Creates a temporary manure application for the MANNER calculator journey.
// `applications_length` is used to generate a reference number (length + 1).
// Returns the new application object.
function createTempApplication (day, month, year, manuretype, rate, applications_length) {
  let newApplication = {
    reference: applications_length + 1,
    date: day + "/" + month + "/" + year,
    manuretype: manuretype,
    rate: rate
  }
  return newApplication
}


// -------------------------
// FERTILISERS
// Functions for creating manufactured fertiliser application records.
// -------------------------

// Current version — creates a fertiliser application with individual nutrient values.
// `group_id`  — always 1 currently (temp value, see route comment)
// `year`      — planning year
// `field_id`  — the field this application is for
// `date`      — date string (e.g. "21/02/2026")
// `nitrogen`, `phosphate`, `potash`, `sulphur`, `lime` — nutrient amounts (blanks become 0)
// Returns the new application object.
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
  return newApplication
}

// Helper used by addFertiliserApplication_v2.
// Converts null or empty nutrient values to 0 so the application object
// doesn't contain blanks.
function convertNutrient (nutrient) {
  if (nutrient == null || nutrient == '') {
    nutrient = 0
  }
  return nutrient
}


// -------------------------
// LIVESTOCK
// -------------------------

// Creates a single livestock item with a type reference and a quantity.
// `reference` — the livestock type reference (e.g. 'dairy-cow')
// `amount`    — the number of animals
// Returns the new livestock item object.
function createLivestockItem (reference, amount) {
  let newItem = {
    reference: reference,
    amount: amount
  }
  return newItem
}


// -------------------------
// STORAGE
// -------------------------

// Creates a new manure storage object.
// `store_type`     — the type of store (e.g. 'slurry tank', 'earth banked lagoon')
// `store_name`     — user-given name (e.g. 'Tank 1')
// `store_material` — what it holds (e.g. 'slurry', 'solid manure')
// Returns the new storage object.
function createStorage(store_type, store_name, store_material) {
  var newGroup = {
    store_type: store_type,
    store_name: store_name,
    store_material: store_material
  }
  return newGroup
}


// -------------------------
// CROP GROUPS
// Helpers for working with crop groups and planning years.
// -------------------------

// Collects field IDs from crop groups based on `option`.
// `option` = 'all'  → collects from every group.
// `option` = a group_id → collects only from that group.
// Returns an array of field IDs.
function collectFieldsFromGroups(cropGroups, option) {
  let fields = []
  for (var x in cropGroups) {
    if (option === 'all' || cropGroups[x].group_id == option) {
      for (var y in cropGroups[x].field_list) {
        fields.push(cropGroups[x].field_list[y])
      }
    }
  }
  return fields
}

// Adds `year` to `years_planned` if it isn't already present.
// Replaces a previous pattern that could push duplicates.
function addYearIfMissing(years_planned, year) {
  if (!years_planned.includes(year)) {
    years_planned.push(year)
  }
}


// -------------------------
// FARM SETUP (PROTOTYPE HELPERS)
// Used in routes_prototype_setup.js to quickly configure a pre-built farm state.
// Not part of the user journey — only used to set up demo scenarios.
// -------------------------

// Marks a farm as set up with fields and soil added.
// `mvpFields` — whether to use the default MVP field list
function basicSetup (farm, mvpFields) {
  farm.setup = true
  farm.soil_added = true
  farm.fields_added = true
  farm.use_mvp_fields = mvpFields
}

// -------------------------
// DEBUG / LOGGING
// Only used for console logging during development.
// -------------------------

// Logs all properties of a crop group to the console.
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
}


// =============================================================================
// EXPORTS
// =============================================================================

module.exports.printCropGroup = printCropGroup;
module.exports.getFieldByReference = getFieldByReference;
module.exports.getMultipleFieldsByReferences = getMultipleFieldsByReferences;
module.exports.totalFieldsCount = totalFieldsCount;
module.exports.basicSetup = basicSetup;
module.exports.createCropGroup = createCropGroup;
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
module.exports.getByName = getByName;
module.exports.createTempApplication = createTempApplication;
module.exports.collectFieldsFromGroups = collectFieldsFromGroups;
module.exports.addYearIfMissing = addYearIfMissing;
