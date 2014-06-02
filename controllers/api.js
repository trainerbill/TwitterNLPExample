'use strict';




module.exports = function (app) {

    function saveAnalyze(data) {
        var analyzeModel = require('../models/analyzeModel');
        var date = new Date();
        data.timestamp = {
            raw: date.getTime(),
            formatted: (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear()
        }
        var analyze = new analyzeModel(data);
        console.log('About to save');
        analyze.save(function (err) {
            if (err) {
                console.log('save error', err);
            }
            console.log('analyze saved');
        });
        //End Saving
        return true;
    }

    function saveTweet(data) {
        var tweetModel = require('../models/tweetModel');
        var date = new Date();
        data.tweettimestamp = {
            raw: date.getTime(),
            formatted: (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear()
        }
        var tweet = new tweetModel(data);
        console.log('About to save');
        tweet.save(function (err) {
            if (err) {
                console.log('save error', err);
            }
            console.log('tweet saved');
        });
        //End Saving
        return true;
    }

    app.post('/api/v1/:product/:method', function (req, res) {
        if (req.params.product === 'twitter') {
            var twitter = require('../lib/twitterconfig');
            if (req.params.method === 'search') {
                twitter.api.get('search/tweets', {q: req.body.value, lang: 'en', count: req.body.count}, function(err, item) {
                    //Setup return array

                    var rvar = [];

                    if (item !== undefined && item !== null && item.statuses !== undefined && item.statuses.length > 0) {
                        saveAnalyze({key: req.body.value});

                        var count = 0;

                        //Setup NLP
                        var standfordSimpleNlpModule  = require('stanford-simple-nlp');
                        var StanfordSimpleNLP = standfordSimpleNlpModule.StanfordSimpleNLP;
                        var stanfordSimpleNLP = new StanfordSimpleNLP();
                        stanfordSimpleNLP.defaultOptions.annotators.push(['sentiment']);
                        stanfordSimpleNLP.loadPipelineSync();

                        item.statuses.forEach( function (status) {

                            try {
                                var temp = {tweet: {user: status.user.screen_name, text: status.text}}
                                stanfordSimpleNLP.process(status.text, function(err, result) {
                                    count++;

                                    temp.nlp = {};

                                    //Check for multiple sentences
                                    if (result.document.sentences.sentence instanceof Array) {
                                        temp.nlp.sentences = [];
                                        var sentimentcheck = {Positive: 0, Negative:0, Neutral: 0}
                                        result.document.sentences.sentence.forEach( function (value) {

                                            sentimentcheck[value.$.sentiment]++;
                                            temp.nlp.sentences.push(value.$)
                                        });
                                        console.log(sentimentcheck);
                                        if (sentimentcheck.Positive > sentimentcheck.Negative) {
                                            temp.nlp.sentiment = 'Positive';
                                        }
                                        else if (sentimentcheck.Positive < sentimentcheck.Negative) {
                                            temp.nlp.sentiment = 'Negative';
                                        }
                                        else {
                                            temp.nlp.sentiment = 'Neutral';
                                        }


                                    }
                                    else {
                                        temp.nlp.sentiment = result.document.sentences.sentence.$.sentiment;
                                        temp.nlp.sentences = [result.document.sentences.sentence.$];
                                    }

                                    rvar.push(temp);
                                    temp.key = req.body.value;
                                    saveTweet(temp);
                                    if ( count >= item.statuses.length ) {
                                        //Output response
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.write(JSON.stringify(rvar));
                                        res.end();
                                    }
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        }
    });
    app.get('/api/v1/history', function (req, res) {

        var analyzeModel = require('../models/analyzeModel');
        var tweetModel = require('../models/tweetModel');
        var rvar = [];
        try {
            analyzeModel
                .aggregate({ $group: { _id: "$key", timestamp: {$max: "$timestamp"}, count: {$sum: 1}}})
                .sort({"timestamp.raw": -1}).limit(30).exec(function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    var count = 0;

                    if( data !== undefined && data.length > 0 ) {
                        data.forEach( function (analyze) {

                            var temp = analyze;
                            tweetModel.find({key: analyze._id}).sort({"timestamp.raw": -1}).limit(30).exec(function (err, tweets) {
                                count++;
                                //console.log(tweets);
                                temp.tweets = tweets;
                                if (temp.tweets !== undefined && temp.tweets.length > 0) {
                                    var sentimentcheck = {Positive: 0, Negative: 0, Neutral: 0};
                                    temp.tweets.forEach( function (tweet) {
                                        sentimentcheck[tweet.nlp.sentiment]++;
                                    });

                                    if (sentimentcheck.Positive > sentimentcheck.Negative) {
                                        temp.sentiment = 'Positive';
                                    }
                                    else if (sentimentcheck.Positive < sentimentcheck.Negative) {
                                        temp.sentiment = 'Negative';
                                    }
                                    else {
                                        temp.sentiment = 'Neutral';
                                    }
                                }
                                temp.sentimentresults = sentimentcheck;
                                rvar.push(temp);

                                if (count >= data.length) {
                                    console.log('count = '+ count);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.write(JSON.stringify(rvar));
                                    res.end();
                                }
                            });
                        });
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write('[]');
                        res.end();
                    }
                });


        }
        catch (err) {
            console.log('Error');
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(err));
            res.end();
        }


    });
};
