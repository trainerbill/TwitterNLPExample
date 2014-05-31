'use strict';

module.exports = function (app) {


    app.post('/api/v1/:product/:method', function (req, res) {


        if (req.params.product === 'twitter') {
            var twitter = require('../lib/twitterconfig');

            if (req.params.method === 'search') {
                twitter.api.get('search/tweets', {q: req.body.value, lang: 'en', count: req.body.count}, function(err, item) {
                    var rvar = [];
                    if (item !== undefined && item !== null && item.statuses !== undefined && item.statuses.length > 0) {

                        var StanfordSimpleNlp = require('stanford-simple-nlp');

                        var count = 0;
                        console.log('Length: '+item.statuses.length);
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
                                        var sentimentcheck = {Positive: 0, Negative:0, Neutral: 0}
                                        result.document.sentences.sentence.forEach( function (value) {
                                            console.log(value);
                                            sentimentcheck[value.$.sentiment]++;
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
                                    }



                                    console.log('Count: ' + count);
                                    rvar.push(temp);

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

};
