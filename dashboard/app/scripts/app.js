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
      .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
        controller: 'SignInCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogOutCtrl'
      })
      .when('/overview', {
        templateUrl: 'views/main.html',
        controller: 'OverViewCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/billing', {
        templateUrl: 'views/billing.html',
        controller: 'BillingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });