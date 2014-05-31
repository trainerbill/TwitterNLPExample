/**
 * Created by athroener on 2/20/14.
 */
"use strict";
/*global application */
application.factory('TwitterResource', function ($resource) {

    return $resource('/api/v1/twitter/:method', {}, {

        post: {method: 'POST', params: {method: '@id'}, isArray: true}

    });
}).controller('Twitter', function ($scope, TwitterResource) {
    console.log('Rocking');
    $scope.twitter = {};
    $scope.twitter.count = 1;

    $scope.Analyze = function () {
        TwitterResource.post({method: 'search'}, {value: $scope.twitter.search, count: $scope.twitter.count, _csrf: $scope.csrf}, function (data) {
            console.log(data);
            $scope.twitter.results = data;
            console.log($scope.twitter);
        });
    };
});