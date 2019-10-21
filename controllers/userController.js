const User = require("../models/User");

exports.login = (req, res) => {
    let user = new User(req.body);
    user.login().then(() => {
        req.session.user = {
            email: user.data.email
        };
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((err) => {
        req.flash("errors", err);
        req.session.save(() => {
            res.redirect("/");
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

exports.signup = (req, res) => {
    let user = new User(req.body);
    user.signup().then(() => {
        req.session.user = {
            email: user.data.email,
        };
        req.session.save(() => {
            res.redirect("/");
        });
    }).catch((regErr) => {
        regErr.forEach((err) => {
            req.flash("regErrors", err);
        });
        req.session.save(() => {
            res.redirect("/");
        });
    });
};


exports.home = (req, res) => {
    if (req.session.user) {
        res.render("home-dashboard", {
            email: req.session.user.email,
        });
    } else {
        res.render("home-guest", {
            errors: req.flash("errors"),
            regErrors: req.flash("regErrors")
        });
    }
};