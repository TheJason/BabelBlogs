'use strict';

angular
  .module('dashboardApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/overview', {
        templateUrl: 'views/main.html',
        controller: 'OverViewCtrl'
      })
      .when('/billing', {
        templateUrl: 'views/main.html',
        controller: 'BillingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
