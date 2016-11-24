// init server
var express = require("express");
var app = express();
var config = require('./server/config/db-config');
var port = process.env.PORT || 8080;
var parser = require('body-parser');
var jwt = require('jsonwebtoken');
// serving public files
app.use(express.static(__dirname + '/web/public'));
app.get('/', function (req, res) {
        res.sendFile(__dirname  + '/web/index.html');
});
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('superSecret', config.secret);
require('./server/database/db.js');
// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});
// authenticate api
app.use('/api', apiRoutes);
require('./server/routes/domain.js')(app);
require('./server/routes/tweets.js')(app);
require('./server/routes/users.js')(app);
app.listen(port);

console.log("Running ..... @ " + port);