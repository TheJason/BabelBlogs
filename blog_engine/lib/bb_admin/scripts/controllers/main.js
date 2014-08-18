'use strict';

angular.module('adminApp')
  /**
   * BabelBlogs Core Controller
   */
  .controller('BBCoreCtrl', function ($sce, $rootScope, $scope, $route, $routeParams, $location, user, Site) {
    $scope.bbcore = {};
    $scope.bbcore.user = user;
    $scope.bbcore.edit = true;
    $scope.bbcore.selectedElement = '';
    // $scope.bbcore.site = Site;

    $scope.versions = [];
    // $scope.contents = {};
    // console.log(JSON.stringify($scope.bbcore.site));

    // jQueryUI Sortable options
    $scope.bbcore.sortablePageMenuOptions = {
      start: function(e, ui) {
        $scope.bbcore.snapShot();
      },
      update: function(e, ui) {
       $scope.bbcore.updateHistorial();
      },
      axis: 'y'
    };

    // Static Login, for Dev purpose(remove it)
    $scope.bbcore.user.logIn('dev', 'default');
    // console.log('isAuthenticated: '+$scope.bbcore.user.isAuthenticated());
    
    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        console.log( 'Schema'+JSON.parse(site[0].get('schema') ) );
        $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        $scope.bbcore.siteQuery = site;
        $scope.$apply();
        Site.siteId = site[0].id;
        // alert('Site.siteId: '+Site.siteId);
        $scope.bbcore.siteId = Site.siteId;
        return $scope.bbcore.site;
      }, function(error) {
        alert(error);
      });
    };
    getSite();

    // Function which add a new page
    $scope.bbcore.addPage = function(name, path, content) {
      // Add the page to the service.
      var newPageId = $scope.bbcore.site.pages.length+1;
      var newPage = {
        id: newPageId,
        title: name,
        description: name,
        type: 'page',
        content: content,
        url: path
      };
      $scope.bbcore.site.pages.push(newPage);

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

    // Toggle HTML Editor
    $scope.toggleEdition = function() {
      if ($scope.bbcore.edit === true) {
        $scope.bbcore.edit = false;
      }
      else {
        $scope.bbcore.edit = true;
      }
    };

    // Turn strings with HTML tags in Trusted HTML
    $scope.trustedHtml = function(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  })

  /**
   * Main Controller
   */
  
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })

  .controller('PostsCtrl', function ($scope) {
    
  })

  .controller('PagesCtrl', function ($scope) {
    
  })



  /**
   * Post Edition
   */
  .controller('PostEditionCtrl', function ($rootScope, $scope,  $route, $routeParams, Site) {
    // $scope.bbcore.currentPage = {};

    $scope.getContent = function () {
      return 'Retrieved Content';
    };

    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        console.log( 'Schema' + JSON.parse(site[0].get('schema') ) );
        $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        // $scope.bbcore.siteQuery = site;
        $scope.$apply();

        // Retrieve siteId
        Site.siteId = site[0].id;
        $scope.bbcore.siteId = Site.siteId;
        $scope.siteId = Site.siteId;
        var siteId = $scope.bbcore.siteId;
        var postId = $routeParams.id;
        console.log('Site.siteId: '+ Site.siteId);

        // Retrieve currentPost
        $scope.bbcore.currentPost = $scope.bbcore.site.posts.filter(function(e) { if (e.postId == postId) {return e;} });
        $scope.bbcore.currentPost = $scope.bbcore.currentPost[0];
        
        $scope.$apply();
        if ($scope.bbcore.currentPost) {
          $rootScope.$broadcast('loadedContent', $scope.bbcore.currentPost.content);
        }
        else {
          $rootScope.$broadcast('loadedContent');
          // Do Something
        }
        
      }, function(error) {
        alert(error.message);
      });
    };
    getSite();
  })



  /**
   * Page Edition
   */
  .controller('PageEditionCtrl', function ($rootScope, $scope,  $route, $routeParams, Site) {
    // $scope.bbcore.currentPage = {};

    $scope.getContent = function () {
      return 'Retrieved Content';
    };

    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        console.log( 'Schema' + JSON.parse(site[0].get('schema') ) );
        $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        // $scope.bbcore.siteQuery = site;
        $scope.$apply();

        // Retrieve siteId
        Site.siteId = site[0].id;
        $scope.bbcore.siteId = Site.siteId;
        $scope.siteId = Site.siteId;
        var siteId = $scope.bbcore.siteId;
        var pageId = $routeParams.id;
        console.log('Site.siteId: '+ Site.siteId);

        // Retrieve currentPage
        $scope.bbcore.currentPage = $scope.bbcore.site.pages.filter(function(e) { if (e.pageId == pageId) {return e;} });
        $scope.bbcore.currentPage = $scope.bbcore.currentPage[0];
        // alert(JSON.stringify($scope.bbcore.currentPage));
        $scope.$apply();
        if ($scope.bbcore.currentPage) {
          $rootScope.$broadcast('loadedContent', $scope.bbcore.currentPage.content);
        }
        else {
          $rootScope.$broadcast('loadedContent');
          // Do Something
        }
        
      }, function(error) {
        alert(error.message);
      });
    };
    getSite();

    // $scope.bbcore.saveSite = function() {
    //   console.log(JSON.stringify($scope.bbcore.site));
    //   // Do Something
    // };
    
  })

  .controller('SeoCtrl', function ($scope) {
    
  })

  .controller('SettingCtrl', function ($scope) {
    
  });
