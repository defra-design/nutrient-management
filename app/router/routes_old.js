router.get(/add_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
})

router.get(/version2_manure_handler/, function (req, res) { 
    req.session.data.show_success_message = true
    req.session.data.successMessage = 2
    if (req.session.data.manure_journey == 'multi') {
        req.session.data.plan_2024.multipleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm//crop_plan/plan_view')
    } else {
        req.session.data.plan_2024.singleManuresApplied = true
        res.redirect('/' + req.session.data.prototype_version + '/farm/field_plan/index')
    }
})

router.get(/check/, function (req, res) { 
    if (req.session.data.manureagain == "yes") {
        req.session.data.manure_count++
        // console.log(req.session.data.manure_count)
        res.redirect('manure_date')
    } else {
        res.redirect('check')
    }
})   
