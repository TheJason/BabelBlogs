'use strict';

angular.module('blogTemplateApp')

  /**
   * BabelBlogs Core Controller
   */
  .controller('BBCoreCtrl', function ($sce, $rootScope, $scope, $route, $location, Site) {
    $scope.bbcore = {};
    $scope.bbcore.edit = true;
    $scope.site = Site;
    $scope.contents = {};

    // Function which add a new page
    $scope.bbcore.addPage = function(name, path, content) {
      // Add the page to the service.
      var newPageId = $scope.site.pages.length+1;
      var newPage = {
        id: newPageId,
        title: name,
        description: name,
        type: 'page',
        content: content,
        url: path
      };
      $scope.site.pages.push(newPage);

      // Add the Route
      var RePath = new RegExp('^\\/'+path+'$');
      var originalPath = '/'+path;

      var keyPath = '';
      if (path === '/') {
        keyPath = path;
        RePath = new RegExp('^\\'+path+'$');
        originalPath = path;
      }
      else {
        keyPath = '/'+path;
      }

      $route.routes[keyPath] = {
        keys: [],
        originalPath: originalPath,
        regexp: RePath,
        reloadOnSearch: true,
        templateUrl: 'views/_page.html'
      };

      if (path !== '/') {
        RePath = new RegExp('^\\/'+path+'\\/'+'$');
        $route.routes[keyPath+'/'] = {
          keys: [],
          originalPath: originalPath+'/',
          regexp: RePath,
          reloadOnSearch: true,
          redirectTo: keyPath
        };
      }

      return newPage;
    };

    // Load Pages from Service and bind their Routes
    $route.routes[''] = {
      keys: [],
      originalPath: '',
      redirectTo: '/',
      regexp: /^$/,
    };
    var i;
    for (i=0; i<Site.pages.length; i++) {
      var page = Site.pages[i];
      var path = page.url;
      var RePath = new RegExp('^\\/'+path+'$');
      var originalPath = '/'+path;

      var keyPath = '';
      if (path === '/') {
        keyPath = path;
        RePath = new RegExp('^\\'+path+'$');
        originalPath = path;
      }
      else {
        keyPath = '/'+path;
      }

      $route.routes[keyPath] = {
        keys: [],
        originalPath: originalPath,
        regexp: RePath,
        reloadOnSearch: true,
        templateUrl: 'views/_page.html'
      };

      if (path !== '/') {
        RePath = new RegExp('^\\/'+path+'\\/'+'$');
        $route.routes[keyPath+'/'] = {
          keys: [],
          originalPath: originalPath+'/',
          regexp: RePath,
          reloadOnSearch: true,
          redirectTo: keyPath
        };
      }
    }
    console.log($route);

    // Toggle HTML Editor
    $scope.toggleEdition = function() {
      if ($scope.bbcore.edit === true) {
        $scope.bbcore.edit = false;
      }
      else {
        $scope.bbcore.edit = true;
      }
    };

    // Turn strings with HTML in Trusted HTML
    $scope.trustedHtml = function(html_code) {
      return $sce.trustAsHtml(html_code);
    };

    // Events Listeners
    $rootScope.$on('$routeChangeSuccess', function() {
      $scope.currentPath = $location.path();
      
      $scope.currentPage = Site.pages.filter(function(e) {
        if (e.url === $scope.currentPath || e.url === $scope.currentPath.replace('/', '')) {
          return e.content;
        }
      });
    });
  })

  /**
   * Main Controller
   */
  .controller('MainCtrl', function ($scope, $route) {
    // Add Code
  });