'use strict';

angular
  .module('blogTemplateApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngDragDrop'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .otherwise({
        redirectTo: '/'
      });

    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
  });