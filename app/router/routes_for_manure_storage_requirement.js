var express = require('express')
var router = express.Router()

var callback_functions = require('./callbacks.js');


// =====================================
// Routes for manure storage requirement
// =====================================

// farm_area_question_router - req.session.data.farm.area_status = true > checklist
router.get(/farm_area_question_router/, function (req, res) {
  req.session.data.farm.area_added = true
  res.redirect('checklist')
})

// rain_water_question_router - req.session.data.farm.rain_water_area_status = true > checklist
router.get(/rain_water_question_router/, function (req, res) {
  req.session.data.farm.rain_water_area_added = true
  res.redirect('checklist')
})

// livestock_question_router - req.session.data.farm.livestock_msreq_status = true > checklist
router.get(/livestock_question_router/, function (req, res) {
  let next
  console.log(req.session.data.livestock_question)
  if (req.session.data.livestock_question == 'no') {
    req.session.data.farm.livestock_msreq_status = 'NONE'
    next = '../checklist'
  } else if (req.session.data.livestock_question == 'yes') {
    // if NLO livestock has been added, offer to copy it across
    if (req.session.data.farm.livestock_nloading_status == 'ADDED_FOR_N_LOADING') {
      next = '/reports/storage_requirement_mvp/manage_livestock/copy'
    } else {
      next = 'type'
    }
  }
  res.redirect(next)
})

// manage_livestock/copy.html → manage_livestock (copies NLO records) or add_livestock/type (start fresh)
router.get(/livestock_copy_for_inventory_handler/, function (req, res) {
  let next
  if (req.session.data.copy_loading == 'yes') {
    req.session.data.livestock_record_plan_year.forEach(function (record) {
      if (record.numbers_for_nloading != null) {
        record.numbers_for_requirement = 1
      }
    })
    req.session.data.farm.livestock_msreq_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
    req.session.data.show_success_message = true
    next = '/reports/storage_requirement_mvp/manage_livestock/index'
  } else {
    next = '/reports/storage_requirement_mvp/add_livestock/type'
  }
  res.redirect(next)
})


// manure_stores_handler - skips question if user already said yes, otherwise shows question
router.get(/manure_stores_handler/, function (req, res) {
  if (req.session.data.farm.manure_stores_status == 'ADDED_FOR_STORAGE_REQUIREMENT') {
    res.redirect('/reset_manage_storage_message_handler')
  } else {
    res.redirect('manure_stores_question')
  }
})

// manure_stores_question_router - sets manure_stores_status and routes to add flow or manage
router.get(/manure_stores_question_router/, function (req, res) {
  let next
  if (req.session.data.manure_stores_question == 'no') {
    req.session.data.farm.manure_stores_status = 'NONE'
    next = 'checklist'
  } else if (req.session.data.manure_stores_question == 'yes') {
    req.session.data.farm.manure_stores_status = 'ADDED_FOR_STORAGE_REQUIREMENT'
    if (req.session.data.farm.manure_stores_added == true) {
      next = '/management/farm/storage/manage_storage'
    } else {
      next = '/planning/add_storage/material_type'
    }
  }
  res.redirect(next)
})

module.exports = router