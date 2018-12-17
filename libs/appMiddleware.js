var appMiddleware = function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = {};
    res.locals.user.username = req.user.username;
    res.locals.user.email = req.user.email;
    res.locals.user.id = req.user._id;
    next();
};

module.exports = appMiddleware;