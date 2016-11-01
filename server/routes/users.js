var User = require("../models/user.js");
var jwt = require('jsonwebtoken');
module.exports = function (app) {
    app.get('/setup', function (req, res) {

        // create a sample user
        var vj = new User({
            name: 'vijay',
            password: 'haha**',
            admin: true
        });

        // save the sample user
        var promise_save = vj.save();
        promise_save.then(function (doc) {
            if (!doc) throw new Error("Unable to save");
            res.json({ success: true, 'name': doc.name, password: "haha**" });
        });
    });

    app.post('/authenticate', function (req, res) {
        // find the user
        User.findOne({
            name: req.body.name
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({name:user.name}, app.get('superSecret'), {
                        expiresIn: 60 * 24 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });
}