'use strict';


var kraken = require('kraken-js'),
    twitter = require('./lib/twitterconfig'),
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    twitter.configure({
        consumer_key: '0UqaQey3SWstAqNndvJGrzjZi',
        consumer_secret: 'qVzWbWdPIAKkKSCuunZ2Ys9k1xw8cv7tAsso8XsAsg8F1J5f0c',
        application_only: true
    });

    console.log(twitter);

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