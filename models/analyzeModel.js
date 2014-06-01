'use strict';

var mongoose = require('mongoose');

var analyzeModel = function () {
    var analyzeSchema = mongoose.Schema({
        key: String,
        timestamp: {
            raw: Number,
            formatted: String
        }
    });

    return mongoose.model('analyze', analyzeSchema);

};

module.exports = new analyzeModel();