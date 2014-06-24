'use strict';

angular
  .module('babelBlogsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        role: 'homepage'
      })
      .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
      })
      .when('/sign-up', {
        templateUrl: 'views/sign-up.html',
      })
      .when('/tour', {
        templateUrl: 'views/tour.html',
      })
      .when('/features', {
        templateUrl: 'views/features.html',
      })
      .when('/templates', {
        templateUrl: 'views/templates.html',
      })
      .when('/pricing', {
        templateUrl: 'views/pricing.html',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
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
      .when('/privacy', {
        templateUrl: 'views/privacy.html'
      })
      .when('/terms', {
        templateUrl: 'views/terms.html'
      })
      .when('/content-policy', {
        templateUrl: 'views/content-policy.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        //controller: 'ContactCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  });