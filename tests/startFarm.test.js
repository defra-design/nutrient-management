// Mock dependencies that routes_prototype_setup loads but startFarm doesn't need
jest.mock('../app/functions/allFunctions.js', () => ({}))
jest.mock('../app/router/callbacks.js', () => ({}))
jest.mock('../app/router/constants.js', () => ({
  LIVESTOCK_INVENTORY_IN_PROGRESS: 'in_progress',
  LIVESTOCK_INVENTORY_COMPLETE: 'complete',
}))

const { startFarm } = require('../app/router/routes_prototype_setup')

describe('startFarm', () => {

  test('returns a farm object with the expected default fields', () => {
    const farm = startFarm()
    expect(farm.created).toBe(true)
    expect(farm.name).toBe('Oaktree Lane Farm')
    expect(farm.postcode).toBe('NE46 7LQ')
    expect(farm.planning_year).toBe(2026)
    expect(farm.rainfall).toBe(600)
    expect(farm.years_planned).toEqual([])
  })

  test('with no argument, setup and fields_added are false', () => {
    const farm = startFarm()
    expect(farm.setup).toBe(false)
    expect(farm.fields_added).toBe(false)
  })

  test('with any type argument, setup and fields_added become true', () => {
    const farm = startFarm('basic')
    expect(farm.setup).toBe(true)
    expect(farm.fields_added).toBe(true)
  })

  test('with type "storage", manure_stores_added is true', () => {
    const farm = startFarm('storage')
    expect(farm.manure_stores_added).toBe(true)
  })

  test('with type "basic", manure_stores_added is not set', () => {
    const farm = startFarm('basic')
    expect(farm.manure_stores_added).toBeUndefined()
  })

})
