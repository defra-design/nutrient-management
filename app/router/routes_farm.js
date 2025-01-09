var express = require('express')
var router = express.Router()

var allFunctions = require('../functions/allFunctions.js');

//set defaults for farm details
router.get(/set_farm_defaults/, function (req, res) { 
    //name
    if (req.session.data.farm_name == "") {
        req.session.data.farm_name = 'Oaktree Lane Farm';
    }
    //postcode
    if (req.session.data.farm_postcode == "") {
        req.session.data.farm_postcode = 'NE46 7LQ';
    }
    //NVZ
    if (req.session.data.farm_nvz == "") {
        req.session.data.farm_nvz = 'all';
    }
    //elevation
    if (req.session.data.farm_elevation == "") {
        req.session.data.farm_elevation = 'none';
    }
    //organic
    // if (req.session.data.organic_producer == "" || req.session.data.organic_producer == 'no' ) {
    //     req.session.data.organic_producer = false;
    // } else {
    //     req.session.data.organic_producer = true;
    // }  
    res.redirect('check');
})

//creates a farm
router.get(/add_farm_handler/, function (req, res) { 
    //name
    req.session.data.oaktree_farm.name = req.session.data.farm_name;
    //postcode
    req.session.data.oaktree_farm.postcode = req.session.data.farm_postcode;
    //NVZ
    req.session.data.oaktree_farm.nvz = req.session.data.farm_nvz;
    req.session.data.oaktree_farm.elevation = req.session.data.farm_elevation;
    req.session.data.oaktree_farm.organic_producer = req.session.data.organic_producer;
    req.session.data.oaktree_farm.setup = true;
    req.session.data.oaktree_farm.latest_update = 'added';
    req.session.data.show_success_message = true;
    // console.log(req.session.data.oaktree_farm)
    res.redirect('/'+ req.session.data.prototype_version +'/farm/hub');
})

module.exports = router