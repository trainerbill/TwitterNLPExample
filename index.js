'use strict';


var kraken = require('kraken-js'),
    twitter = require('./lib/twitterconfig'),
    mongoose = require('./lib/mongoose'),
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.

    //Configure twitter
    var twitconfig = nconf.get('twitter');
    twitconfig.application_only = true;
    twitter.configure(twitconfig);

    //Configure mongoose
    mongoose.config(nconf.get('databaseConfig'));


    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err);
        }
    });
}


module.exports = app;