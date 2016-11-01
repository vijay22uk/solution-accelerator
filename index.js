// init server
var express = require("express");
var app = express();
var config = require('./server/config/db-config');
var port = process.env.PORT || 8080;
var parser = require('body-parser');
// serving public files
app.use(express.static(__dirname + '/web/public'));
app.get('/', function (req, res) {
        res.sendFile(__dirname  + '/web/index.html');
});
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('superSecret', config.secret);
require('./server/database/db.js');
require('./server/routes/domain.js')(app);
require('./server/routes/tweets.js')(app);
require('./server/routes/users.js')(app);
app.listen(port);

console.log("Running ..... @ " + port);