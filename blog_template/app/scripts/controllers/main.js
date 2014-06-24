'use strict';

angular.module('blogTemplateApp')

  /**
   * BabelBlogs Core
   */
  .controller('BBCoreCtrl', function ($sce, $rootScope, $scope, $route, $location, Site) {
    $scope.bbcore = {};
    $scope.bbcore.edit = true;
    $scope.site = Site;
    $scope.contents = {};

    // Load Pages from Services
    var i;
    for (i=0; i<Site.pages.length; i++) {
      var page = Site.pages[i];
      var path = page.url;
      var content = page.content;
      var RePath = new RegExp('^\/'+path+'$');

      $route.routes['/'+path+'/'] = {
        keys: [],
        originalPath: '/'+path,
        regexp: RePath,
        reloadOnSearch: true,
        // template: content,
        templateUrl: 'views/_page.html',
        // controller: function($scope) {
        //   $scope.contents[path] = content;
        // }
      };
    }

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
    }

    // Events Listeners
    $rootScope.$on('$routeChangeSuccess', function() {
      $scope.currentPath = $location.path();
      //.replace('/','');
      $scope.currentPage = Site.pages.filter(function(e) {
        if (e.url === $scope.currentPath.replace('/', '')) {
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