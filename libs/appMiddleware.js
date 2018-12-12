var appMiddleware = function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
}

module.exports = appMiddleware;