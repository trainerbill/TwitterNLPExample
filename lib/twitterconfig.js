"use strict";



function configure (options) {
    var twitterAPI = require('mtwitter');
    twitter.api = new twitterAPI(options);
    console.log('Now');
    console.log(twitter);
}

var twitter = {
    configure: configure,
    api: {}
};

module.exports = twitter;
