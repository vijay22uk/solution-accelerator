var request = require('request');
var util = require('util');
var swKey = process.env.KEY;  
var baseUrl = "http://api.similarweb.com/Site/";

module.exports = function (app) {
    app.route('/api/competitor')
        .get(function (req, res) {
            var siteName = req.param('siteName')
            var subUrl = util.format(baseUrl + "%s/v1/%s?UserKey=%s&Format=JSON", siteName.toLowerCase(), "similarsites", swKey);
            console.log("URL IS :: %s ",subUrl);
            request(subUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.status(200).send(body);
                }else{
                    console.log(error);
                    res.status(500).send("Url kya tha bhai");
                }
            })

        })
        .post(function (req, res) {
            var _book = req.body;
             res.status(200).send();
        })
}
