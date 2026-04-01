// =============================================================================
// SHARED CONSTANTS
// Named values used across router files in place of magic numbers.
// =============================================================================

// livestock_inventory — tracks the state of livestock data entry
const LIVESTOCK_INVENTORY_IN_PROGRESS = 2  // started: data entered but not yet fully confirmed
const LIVESTOCK_INVENTORY_COMPLETE = 3     // done: all livestock data confirmed and saved
const LIVESTOCK_INVENTORY_NO_LIVESTOCK = 4 // user confirmed the farm has no livestock

module.exports = {
  LIVESTOCK_INVENTORY_IN_PROGRESS,
  LIVESTOCK_INVENTORY_COMPLETE,
  LIVESTOCK_INVENTORY_NO_LIVESTOCK
}
