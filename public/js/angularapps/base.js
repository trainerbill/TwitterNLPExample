"use strict";
/*global $ */
/*global angular */
var application = angular.module('application', ['ngResource', 'ngRoute'])
    .config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('~~');
        $interpolateProvider.endSymbol('~~');
    }).config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/js/angularapps/partials/pages/home.html'
                //controller: 'Debugger'
            })
            .otherwise({redirectTo: '/'});


        // configure html5 to get links working on jsfiddle
        //$locationProvider.html5Mode(true);
    });