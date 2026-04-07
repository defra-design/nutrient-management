const f = require('../app/functions/allFunctions')


// -------------------------
// LOOKUP HELPERS
// -------------------------

describe('getByReference', () => {

  const types = [
    { name: 'Cattle FYM', reference: 'cattle-fym' },
    { name: 'Pig Slurry', reference: 'pig-slurry' },
  ]

  test('finds an item by its reference property', () => {
    expect(f.getByReference(types, 'cattle-fym')).toEqual({ name: 'Cattle FYM', reference: 'cattle-fym' })
  })

  test('finds an item by its name property', () => {
    expect(f.getByReference(types, 'Pig Slurry')).toEqual({ name: 'Pig Slurry', reference: 'pig-slurry' })
  })

  test('returns undefined if nothing matches', () => {
    expect(f.getByReference(types, 'unknown')).toBeUndefined()
  })

})

describe('getByName', () => {

  const types = [
    { name: 'Cattle FYM' },
    { name: 'Pig Slurry' },
  ]

  test('finds an item by name', () => {
    expect(f.getByName(types, 'Cattle FYM')).toEqual({ name: 'Cattle FYM' })
  })

  test('returns undefined if nothing matches', () => {
    expect(f.getByName(types, 'unknown')).toBeUndefined()
  })

})


// -------------------------
// FIELDS
// -------------------------

describe('getFieldByReference', () => {

  const fields = [
    { field_id: 1, field_name: 'Top Field' },
    { field_id: 2, field_name: 'Long Field' },
  ]

  test('returns the right field by ID', () => {
    expect(f.getFieldByReference(fields, 2)).toEqual({ field_id: 2, field_name: 'Long Field' })
  })

  test('returns undefined if ID not found', () => {
    expect(f.getFieldByReference(fields, 99)).toBeUndefined()
  })

})

describe('setFieldName', () => {

  test('sets the field name to the provided name', () => {
    const field = {}
    f.setFieldName(field, 'Home Farm', 4)
    expect(field.field_name).toBe('Home Farm')
    expect(field.field_id).toBe(5)
  })

  test('generates a default name when name is blank', () => {
    const field = {}
    f.setFieldName(field, '', 2)
    expect(field.field_name).toBe('New Field #3')
  })

  test('generates a default name when name is null', () => {
    const field = {}
    f.setFieldName(field, null, 0)
    expect(field.field_name).toBe('New Field #1')
  })

})

describe('setFieldSizes', () => {

  test('sets all three areas when all are provided', () => {
    const field = {}
    f.setFieldSizes(field, 10, 8, 2)
    expect(field.total_area).toBe(10)
    expect(field.cropped_area).toBe(8)
    expect(field.non_spreading_area).toBe(2)
  })

  test('skips a value if it is empty string', () => {
    const field = { total_area: 5 }
    f.setFieldSizes(field, '', 3, '')
    expect(field.total_area).toBe(5)    // unchanged
    expect(field.cropped_area).toBe(3)
    expect(field.non_spreading_area).toBeUndefined()
  })

})


// -------------------------
// CROPS
// -------------------------

describe('createCropGroup', () => {

  test('returns a crop group with the expected properties', () => {
    const group = f.createCropGroup(null, 1, 2026, 'Wheat-Winter', [1, 2, 3])
    expect(group.group_id).toBe(1)
    expect(group.year).toBe(2026)
    expect(group.crop_id).toBe('Wheat-Winter')
    expect(group.field_list).toEqual([1, 2, 3])
  })

})

describe('setCropAndGroupId', () => {

  test('assigns crop and group to matching fields', () => {
    const fields = [
      { field_id: 1 },
      { field_id: 2 },
      { field_id: 3 },
    ]
    f.setCropAndGroupId(fields, [1, 3], 'Wheat-Winter', 1)
    expect(fields[0].crop_id).toBe('Wheat-Winter')
    expect(fields[0].group_id).toBe(1)
    expect(fields[1].crop_id).toBeUndefined()   // field 2 not in chosen list
    expect(fields[2].crop_id).toBe('Wheat-Winter')
  })

})

describe('addYearIfMissing', () => {

  test('adds a year if it is not already in the array', () => {
    const years = [2025]
    f.addYearIfMissing(years, 2026)
    expect(years).toEqual([2025, 2026])
  })

  test('does not add a duplicate year', () => {
    const years = [2025, 2026]
    f.addYearIfMissing(years, 2026)
    expect(years).toEqual([2025, 2026])
  })

})

describe('collectFieldsFromGroups', () => {

  const groups = [
    { group_id: 1, field_list: [1, 2] },
    { group_id: 2, field_list: [3, 4] },
  ]

  test('"all" collects every field from every group', () => {
    expect(f.collectFieldsFromGroups(groups, 'all')).toEqual([1, 2, 3, 4])
  })

  test('a group_id collects only from that group', () => {
    expect(f.collectFieldsFromGroups(groups, 2)).toEqual([3, 4])
  })

  test('returns empty array if group_id does not match', () => {
    expect(f.collectFieldsFromGroups(groups, 99)).toEqual([])
  })

})


// -------------------------
// MANURES
// -------------------------

describe('add_manure_application', () => {

  test('returns a manure application with the expected properties', () => {
    const app = f.add_manure_application(1, 2026, 5, '21/02/2026', 'cattle-fym')
    expect(app.group_id).toBe(1)
    expect(app.year).toBe(2026)
    expect(app.field_id).toBe(5)
    expect(app.application_date).toBe('21/02/2026')
    expect(app.manure_id).toBe('cattle-fym')
    expect(app.rate).toBe('20')
  })

})

describe('createTempApplication', () => {

  test('formats the date and sets all properties', () => {
    const app = f.createTempApplication('01', '06', '2026', 'cattle-fym', 30, 2)
    expect(app.date).toBe('01/06/2026')
    expect(app.manuretype).toBe('cattle-fym')
    expect(app.rate).toBe(30)
    expect(app.reference).toBe(3)   // applications_length + 1
  })

})


// -------------------------
// FERTILISERS
// -------------------------

describe('addFertiliserApplication', () => {

  test('returns an application with the correct nutrient values', () => {
    const app = f.addFertiliserApplication(1, 2026, 3, '01/03/2026', 40, 20, 10, 5, 0)
    expect(app.nitrogen).toBe(40)
    expect(app.P2O5).toBe(20)
    expect(app.K2O).toBe(10)
    expect(app.SO3).toBe(5)
    expect(app.Lime).toBe(0)
    expect(app.field_id).toBe(3)
  })

  test('converts null nutrient values to 0', () => {
    const app = f.addFertiliserApplication(1, 2026, 1, '01/03/2026', null, null, null, null, null)
    expect(app.nitrogen).toBe(0)
    expect(app.P2O5).toBe(0)
  })

  test('converts empty string nutrient values to 0', () => {
    const app = f.addFertiliserApplication(1, 2026, 1, '01/03/2026', '', '', '', '', '')
    expect(app.nitrogen).toBe(0)
  })

})


// -------------------------
// STORAGE
// -------------------------

describe('createStorage', () => {

  test('returns a storage object with the expected properties', () => {
    const store = f.createStorage('slurry tank', 'Tank 1', 'slurry')
    expect(store.store_type).toBe('slurry tank')
    expect(store.store_name).toBe('Tank 1')
    expect(store.store_material).toBe('slurry')
  })

})
