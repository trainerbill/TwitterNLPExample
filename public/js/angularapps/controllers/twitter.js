/**
 * Created by athroener on 2/20/14.
 */
"use strict";
/*global application */
application.controller('Twitter', function ($scope) {
    console.log('Rocking');
    $scope.twitter = {};

    $scope.Analyze = function () {
        console.log($scope.twitter.search);
    };
});