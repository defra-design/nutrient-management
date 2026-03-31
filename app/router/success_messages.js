// =============================================================================
// SUCCESS MESSAGE IDs
// Used to trigger the right success notification banner after an action.
//
// The same ID can show different banner text on different pages — because each
// page includes its own success message template, and each template only
// responds to the IDs relevant to it.
//
// Usage: req.session.data.successMessage = SUCCESS.CROP_PLAN.MANURE_ADDED
// =============================================================================

const SUCCESS = {

  // Farm hub page
  // Template: management/farm/templates/success_messages.html
  FARM: {
    ADDED: 1,   // "You have added {farm name}"
    REMOVED: 2, // "You have removed {farm name}"
  },

  // Field management pages
  // Template: management/farm/field/templates/success_messages.html
  FIELD: {
    ADDED: 3,        // "You have added {field name}"
    UPDATED: 4,      // "You have updated {field name}"
    SOIL_UPDATED: 5, // "You have updated a soil analysis for {field name}"
  },

  // Crop plan view
  // Template: management/farm/crop_plan/templates/success_message.html
  CROP_PLAN: {
    CROPS_ADDED: 1,         // "Crops added for {year}"
    MANURE_ADDED: 2,        // "Organic material application added to fields in this plan"
    FERTILISER_ADDED: 3,    // "Inorganic fertiliser application added to fields in this plan"
    PLAN_UPDATED: 6,        // "Crop plan updated"
    RAINFALL_UPDATED: 12,   // "Excess Winter Rainfall for {year} updated"
    MANURE_UPDATED: 13,     // "Organic material application updated"
    FERTILISER_UPDATED: 14, // "Inorganic fertiliser application updated"
    FERTILISER_REMOVED: 15, // "Inorganic fertiliser application removed"
    GRASS_ADDED: 16,        // "Grass added for {year}"
    SNS_ADDED: 17,          // "Plan created for {year}"
  },

  // Field plan view (per-field)
  // Template: management/farm/field_plan/templates/success_message.html
  FIELD_PLAN: {
    SNS_ADDED: 17, // "Soil mineral nitrogen analysis results added to {field name}"
  },

  // Exports section
  EXPORTS: {
    UPDATED: 2, // success banner on the manage exports page
  },

  // Manner calculator
  // Template: manner/success_message.html
  MANNER: {
    DONE: 1,          // "Nutrient supply estimated"
    VALUE_UPDATED: 2, // "Organic material value updated"
    CHANGED: 3,       // "Nutrient supply and value updated"
  },

}

module.exports = SUCCESS
