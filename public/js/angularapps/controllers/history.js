/**
 * Created by athroener on 2/20/14.
 */
"use strict";
/*global application */
application.factory('HistoryResource', function ($resource) {

    return $resource('/api/v1/history', {}, {

        get: {method: 'GET', params: {}, isArray: true}

    });
}).controller('History', function ($scope, $rootScope, HistoryResource) {

    $scope.history = {};
    $scope.history.tweetsearch = '';
    $scope.history.sentimentfilter = '';

    //Watch for changes in twitter.results
    $scope.$watch('refreshHistory', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.getHistory();
        }
    });

    $scope.getHistory = function () {
        HistoryResource.get({}, {}, function (data) {

            $scope.history.results = data;
            console.log($scope.history);

        });
    };

    $scope.getHistory();

});