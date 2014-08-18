'use strict';

angular
  .module('adminApp', [
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
      .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/new', {
        templateUrl: 'views/post_editor.html',
        controller: 'PostEditionCtrl'
      })
      .when('/posts/edit/:id', {
        templateUrl: 'views/post_editor.html',
        controller: 'PostEditionCtrl'
      })
      .when('/pages', {
        templateUrl: 'views/pages.html',
        controller: 'PagesCtrl'
      })
      .when('/pages/new', {
        templateUrl: 'views/page_editor.html',
        controller: 'PageEditionCtrl'
      })
      .when('/pages/edit/:id', {
        templateUrl: 'views/page_editor.html',
        controller: 'PageEditionCtrl'
      })
      .when('/seo', {
        templateUrl: 'views/seo.html',
        controller: 'SeoCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });