'use strict';

angular
  .module('babelBlogsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        role: 'homepage'
      })
      .when('/subpage', {
        templateUrl: 'views/subpage.html',
        //controller: 'MainCtrl'
      })
      .when('/tour', {
        templateUrl: 'views/tour.html',
        //controller: 'MainCtrl'
      })
      .when('/features', {
        templateUrl: 'views/features.html',
        //controller: 'MainCtrl'
      })
      .when('/templates', {
        templateUrl: 'views/templates.html',
        //controller: 'MainCtrl'
      })
      .when('/pricing', {
        templateUrl: 'views/pricing.html',
        //controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });