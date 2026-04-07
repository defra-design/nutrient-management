const SUCCESS = require('../app/router/success_messages')

describe('SUCCESS message IDs', () => {

  test('FARM group has ADDED and REMOVED', () => {
    expect(SUCCESS.FARM.ADDED).toBe(1)
    expect(SUCCESS.FARM.REMOVED).toBe(2)
  })

  test('FIELD group has ADDED, UPDATED, and SOIL_UPDATED', () => {
    expect(SUCCESS.FIELD.ADDED).toBe(3)
    expect(SUCCESS.FIELD.UPDATED).toBe(4)
    expect(SUCCESS.FIELD.SOIL_UPDATED).toBe(5)
  })

  test('CROP_PLAN group has expected IDs', () => {
    expect(SUCCESS.CROP_PLAN.CROPS_ADDED).toBe(1)
    expect(SUCCESS.CROP_PLAN.MANURE_ADDED).toBe(2)
    expect(SUCCESS.CROP_PLAN.FERTILISER_ADDED).toBe(3)
    expect(SUCCESS.CROP_PLAN.PLAN_UPDATED).toBe(6)
    expect(SUCCESS.CROP_PLAN.RAINFALL_UPDATED).toBe(12)
    expect(SUCCESS.CROP_PLAN.MANURE_UPDATED).toBe(13)
    expect(SUCCESS.CROP_PLAN.FERTILISER_UPDATED).toBe(14)
    expect(SUCCESS.CROP_PLAN.FERTILISER_REMOVED).toBe(15)
    expect(SUCCESS.CROP_PLAN.GRASS_ADDED).toBe(16)
    expect(SUCCESS.CROP_PLAN.SNS_ADDED).toBe(17)
  })

  test('MANNER group has DONE, VALUE_UPDATED, and CHANGED', () => {
    expect(SUCCESS.MANNER.DONE).toBe(1)
    expect(SUCCESS.MANNER.VALUE_UPDATED).toBe(2)
    expect(SUCCESS.MANNER.CHANGED).toBe(3)
  })

})
