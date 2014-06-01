/**
 * Created by athroener on 2/20/14.
 */
"use strict";
/*global application */
application.factory('TwitterResource', function ($resource) {

    return $resource('/api/v1/twitter/:method', {}, {

        post: {method: 'POST', params: {method: '@id'}, isArray: true}

    });
}).controller('Twitter', function ($scope, $rootScope, TwitterResource) {
    console.log('Rocking');
    $scope.twitter = {};
    $scope.twitter.count = 1;
    $rootScope.refreshHistory = 0;


    $scope.Analyze = function () {
        $scope.twitter.analyzing = 1;
        $scope.twitter.results = undefined;
        TwitterResource.post({method: 'search'}, {value: $scope.twitter.search, count: $scope.twitter.count, _csrf: $scope.csrf}, function (data) {

            $scope.twitter.results = data;
            $scope.twitter.analyzing = 0;
            $rootScope.refreshHistory++;
        });
    };
});