'use strict';

var mongoose = require('mongoose');

var tweetModel = function () {

    //Define a super simple schema for our products.
    var tweetSchema = mongoose.Schema({
        key: String,
        tweet: {
            user: String,
            text: String
        },
        nlp: {
            sentiment: String,
            sentences: Array
        },
        tweettimestamp: {
            raw: Number,
            formatted: String
        }
    });

    return mongoose.model('tweets', tweetSchema);

};

module.exports = new tweetModel();