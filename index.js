// init server
var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var parser = require('body-parser');
// serving public files
app.use(express.static(__dirname + '/web/public'));
app.get('/', function (req, res) {
        res.sendFile(__dirname  + '/web/index.html');
});
require('./server/routes/domain.js')(app);
require('./server/routes/tweets.js')(app);
app.listen(port);
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
console.log("Running ..... @ " + port);