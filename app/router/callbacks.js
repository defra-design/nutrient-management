function hide_error(req, res, next) {
    req.session.data.show_error = false
    next()
}

function showSuccessMessage(req, res, next) {
    req.session.data.show_success_message = true
    next()
}

function hideSuccessMessage(req, res, next) {
    req.session.data.show_success_message = false
    next()
}

function setManureGroup(req, res, next) {
    const manureTypes = {
        livestock: req.session.data.manure_type_livestock_data,
        biosolids: req.session.data.manure_type_biosolid_data,
        other:     req.session.data.manure_type_other_data,
        digestate: req.session.data.manure_type_digestate_data,
    }
    const groupId = req.session.data.manure_group_id || 'livestock'
    req.session.data.manure_types = manureTypes[groupId]
    next()
}

function getApplicationByReference(req, res, next) {
    req.session.data.application_ref = req.query.applicationref
    next()
}

module.exports.hide_error = hide_error;
module.exports.showSuccessMessage = showSuccessMessage;
module.exports.hideSuccessMessage = hideSuccessMessage;
module.exports.setManureGroup = setManureGroup;
module.exports.getApplicationByReference = getApplicationByReference;
