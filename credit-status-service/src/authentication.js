const userAPI = require('./userAPI');

const parseKey = function (req, res, next) {
    if(!req.headers.authorization) {
        return res
          .status(403)
          .json({status: "Auth key missing in header"});
    }
    res.locals.key = req.headers.authorization.split(" ")[1];
    next()
}

const hasQuota = async function(required_quota, res) {
    var key = res.locals.key;
    var available = await userAPI.getAvailableQuota(key);
    if (required_quota > available) {
        res
          .status(403)
          .json({status: "Your available quota is not enough to fulfill your request. Needed: " + required_quota + " / available: "+available});
        return false;
    }

    //TODO: Add logic to post consumed quota to remote service

    return true;
}


module.exports = { parseKey, hasQuota }