module.exports = {
    yesAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    noAuth: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};