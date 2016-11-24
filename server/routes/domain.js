var request = require('request');
var util = require('util');
var swKey = process.env.KEY || "d4bf3ff6fe19993f38d369138f206b44";
var baseUrl = "http://api.similarweb.com/Site/";
var Company = require("../models/company.js");
var Keywords = require("../models/keywords.js");
module.exports = function (app) {
    app.route('/api/competitor')
        .get(function (req, res) {
            var siteName = req.param('siteName');
            var subUrl = util.format(baseUrl + "%s/v1/%s?UserKey=%s&Format=JSON", siteName.toLowerCase(), "similarsites", swKey);
            request(subUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.status(200).send(body);
                } else {
                    console.log(error);
                    res.status(500).send("Url not valid");
                }
            })
        })
        .post(function (req, res) {
            var _company = req.body.company;
            var query = { 'name': _company.name };
            Company.findOneAndUpdate(query, _company, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err });

                // save keywords
                //var rawDocuments = req.body.keywords.split(",");
                //var rawDocumentsArray = [];
                
                // Keywords.insertMany(rawDocuments)
                //     .then(function (mongooseDocuments) {
                //         /* ... */
                //     })
                //     .catch(function (err) {
                //         /* Error handling */
                //     });


                return res.send("succesfully saved");
            });
            //res.status(200).send();
        })

    app.route('/api/company')
        .get(function (req, res) {
            Company.find(function (err, company) {
                if (err) {
                    res.status(500).send("error");
                } else {
                    res.status(200).send(company);
                }
            })

        });

    app.get("/api/companydetails/:id", function (req, res) {
        var id = req.params.id;
        Company.findById(id).
            populate('keywords')
            .exec(function (err, company) {
                if (err) {
                    res.status(500).send("error");
                } else {
                    res.status(200).send(company);
                }
            })




    })

}
