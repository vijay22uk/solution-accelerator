var request = require('request');
var Twitter = require('twitter');
var sentiment = require('sentiment');
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY || "9itqGNsEEeJFvE3MKozJVbgUe",
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || "RcNkmZuUcO1xs496M4iZIJpXKzJU36Psm6FNEiJIZLUpSsE6Bk",
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || "2457744018-9m8kjP8EhxJptHQCDqp2HohrgGPDsneKqefZFF5",
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "BB94SF3pFJIcT5rdoNdOdVrDoKl1Fm3ORVvUu0extGAJP"
});
module.exports = function (app) {
    app.route('/api/search')
        .get(function (req, res) {
            var siteName =  '#' + req.param('siteName');
            client.get('search/tweets', { q: siteName,count:20,lang:"en" }, function (error, tweets, response) {
                tweets = tweets || {statuses:[]}
                var status = tweets.statuses ||[];
                for(var t=0;t<status.length;t++){
                    var _t = status[t].text;
                    var score = sentiment(_t);
                    status[t].score = score.Score;
                }
                res.status(200).send(status);
            });

        })
        .post(function (req, res) {
            var _book = req.body;
            res.status(200).send();
        })
}
