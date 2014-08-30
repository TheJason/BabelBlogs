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
        controller: 'PostsCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/posts/new', {
        templateUrl: 'views/post_editor.html',
        controller: 'PostEditionCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/posts/edit/:id', {
        templateUrl: 'views/post_editor.html',
        controller: 'PostEditionCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/pages', {
        templateUrl: 'views/pages.html',
        controller: 'PagesCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/pages/new', {
        templateUrl: 'views/page_editor.html',
        controller: 'PageEditionCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/pages/edit/:id', {
        templateUrl: 'views/page_editor.html',
        controller: 'PageEditionCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/seo', {
        templateUrl: 'views/seo.html',
        controller: 'SeoCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          schema: function() {
            var query = new Parse.Query('Site');
            var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
            query.equalTo('url', siteUrl);
            return query.find().then(function(site) {
              return JSON.parse(site[0].get('schema'));
            }, function(error) {
              alert(error);
            });
          }
        }
      })
      .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
        controller: 'SignInCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogOutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });