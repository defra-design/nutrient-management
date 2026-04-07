const {
  LIVESTOCK_INVENTORY_IN_PROGRESS,
  LIVESTOCK_INVENTORY_COMPLETE,
  LIVESTOCK_INVENTORY_NO_LIVESTOCK,
} = require('../app/router/constants')

describe('constants', () => {

  test('LIVESTOCK_INVENTORY_IN_PROGRESS is 2', () => {
    expect(LIVESTOCK_INVENTORY_IN_PROGRESS).toBe(2)
  })

  test('LIVESTOCK_INVENTORY_COMPLETE is 3', () => {
    expect(LIVESTOCK_INVENTORY_COMPLETE).toBe(3)
  })

  test('LIVESTOCK_INVENTORY_NO_LIVESTOCK is 4', () => {
    expect(LIVESTOCK_INVENTORY_NO_LIVESTOCK).toBe(4)
  })

  test('all three values are different from each other', () => {
    const values = [LIVESTOCK_INVENTORY_IN_PROGRESS, LIVESTOCK_INVENTORY_COMPLETE, LIVESTOCK_INVENTORY_NO_LIVESTOCK]
    const unique = new Set(values)
    expect(unique.size).toBe(3)
  })

})
