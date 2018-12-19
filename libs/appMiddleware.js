var appMiddleware = function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = {};
    if (req.user !== undefined) {
        res.locals.user.username = req.user.username === undefined ? null : req.user.username;
        res.locals.user.email = req.user.email === undefined ? null : req.user.email;
        res.locals.user.id = req.user._id === undefined ? null : req.user._id;
    }

    next();
};

module.exports = appMiddleware;