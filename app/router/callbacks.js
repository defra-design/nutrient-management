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
    if (req.session.data.manure_group_id == null || req.session.data.manure_group_id == "livestock") {
        req.session.data.manure_types = req.session.data.manure_type_livestock_data
    } else if (req.session.data.manure_group_id == "biosolids") {
        req.session.data.manure_types = req.session.data.manure_type_biosolid_data
    } else if (req.session.data.manure_group_id == "other") {
        req.session.data.manure_types = req.session.data.manure_type_other_data
    } else if (req.session.data.manure_group_id == "digestate") {
        req.session.data.manure_types = req.session.data.manure_type_digestate_data
    }
    next()
}

const getApplicationByReference = function (req, res, next) {
    req.session.data.application_ref = req.query.applicationref
    next()
}

module.exports.hide_error = hide_error;
module.exports.showSuccessMessage = showSuccessMessage;
module.exports.hideSuccessMessage = hideSuccessMessage;
module.exports.setManureGroup = setManureGroup;
module.exports.getApplicationByReference = getApplicationByReference;