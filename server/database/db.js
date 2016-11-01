var mongoose = require('mongoose');
var dbConfig = require('../config/db-config.js');
mongoose.connect(dbConfig.connectionString,function (params) {
   
    // uncomment below if want to start fresh on each deploy.
    //moongoose.connection.db.dropDatabase();
})
mongoose.connection.on('error', function () {
    console.log('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
     console.log("Connected to db");
});