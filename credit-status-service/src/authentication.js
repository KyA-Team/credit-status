var parseKey = function (req, res, next) {
    if(!req.headers.authorization) {
        return res
          .status(403)
          .json({status: "Auth key missing in header"});
    }
    res.locals.key = req.headers.authorization.split(" ")[1];
    next()
}

var requestQuota = function(required_quota, res) {
    var key = res.locals.key
    var available = { 'limit10': 10, 'limit2': 2, 'limit0': 0, 'limit1': 1 }[key] || 0 //TODO: Add logic to contact remote service and check quota
    if (required_quota > available) {
        res
          .status(403)
          .json({status: "Your available quota is not enough to fulfill your request. Needed: " + required_quota + " / available: "+available});
        return false;
    }

    //TODO: Add logic to post consumed quota to remote service

    return true;
}


module.exports = { parseKey, requestQuota }