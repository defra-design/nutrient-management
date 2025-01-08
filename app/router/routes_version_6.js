var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//FARM
router.get(/add_farms_v6_handler/, function (req, res) { 
    //name
    req.session.data.chosen_farm.name = req.session.data.farm_name;
    //postcode
    req.session.data.chosen_farm.postcode = req.session.data.farm_postcode;
    //NVZ
    req.session.data.chosen_farm.nvz = req.session.data.farm_nvz;
    req.session.data.chosen_farm.elevation = req.session.data.farm_elevation;
    req.session.data.chosen_farm.organic_producer = req.session.data.organic_producer ;
    req.session.data.chosen_farm.setup = true;
    req.session.data.chosen_farm.latest_update = 'added';
    req.session.data.show_success_message = true;
    // console.log(req.session.data.chosen_farm)
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub');
})

//PLAN
router.get(/rainfall_update_v6_handler/, function (req, res) { 
    req.session.data.show_success_message = true   
    req.session.data.successMessage = 12;
    req.session.data.chosen_farm.rainfall = req.session.data.rainfall
    res.redirect('../plan_view')
})

module.exports = router