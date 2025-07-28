const hide_error = function (req, res, next) {
    req.session.data.show_error = false
    next()
}

const showSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = true
    next()
}

const hideSuccessMessage = function (req, res, next) {
    req.session.data.show_success_message = false
    next()
}

const setManureGroup = function (req, res, next) {
    if (req.session.data.manure_group_id == "livestock") {
        req.session.data.manure_types = req.session.data.manure_types_livestock
    } else if (req.session.data.manure_group_id == "biosolids") {
        req.session.data.manure_types = req.session.data.manure_types_biosolid
    } else if (req.session.data.manure_group_id == "other") {
        req.session.data.manure_types = req.session.data.manure_types_other
    } else if (req.session.data.manure_group_id == "digestate") {
        req.session.data.manure_types = req.session.data.manure_types_digestate
    }
    // console.log('manure types = ' + req.session.data.manure_types)
    next()
}

const default_grass_values = function (req, res, next) {
    // if (req.session.data.crop_fields == null || req.session.data.crop_fields == []) {
    //     req.session.data.crop_fields = ['Long Field', 'Short Field']
    // }
    next()
} 

const getApplicationByReference = function (req, res, next) {
    req.session.data.application_ref = req.query.applicationref
    // console.log('Application Ref = ' + req.session.data.application_ref)
    next()
}


module.exports.hide_error = hide_error;
module.exports.showSuccessMessage = showSuccessMessage;
module.exports.hideSuccessMessage = hideSuccessMessage;
module.exports.setManureGroup = setManureGroup;
module.exports.default_grass_values = default_grass_values;
module.exports.getApplicationByReference = getApplicationByReference;