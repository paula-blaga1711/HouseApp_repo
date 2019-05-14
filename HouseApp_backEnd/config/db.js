const config = require('./config');

var db = require('mongoose');
db.connect(config.database, config.databaseConfig);

db.connection.once('open', function () {
    console.log('Connection to database has been established.');
}).on('error', function (error) {
    console.log('An error occured while trying to connect to the database: ', error);
});