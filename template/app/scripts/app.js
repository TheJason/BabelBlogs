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
      .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
        //controller: 'MainCtrl'
      })
      .when('/sign-up', {
        templateUrl: 'views/sign-up.html',
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
      .when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl'
      })
      .when('/blog/:id', {
        templateUrl: 'views/blog-entry.html',
        controller: 'BlogEntryCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FAQCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });