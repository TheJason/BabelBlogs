'use strict';

angular.module('blogTemplateApp')

  /**
   * BabelBlogs Core Controller
   */
  .controller('BBCoreCtrl', function ($sce, $rootScope, $scope, $route, $location, user) {
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
      query.equalTo('objectId','Y4KkHHrfrQ');
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        console.log( 'Schema'+JSON.parse(site[0].get('schema') ) );
        $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        $scope.bbcore.siteQuery = site;
        $scope.$apply();
        return $scope.bbcore.site;
      }).then(function(Site) {
        $scope.bbcore.site = Site;
        // Load Pages from Service and bind their Routes.        
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
        $route.reload();
        
        /**
         * Events Listeners
         */
        // When Route Change Success
        $rootScope.$on('$routeChangeSuccess', function() {
          $scope.currentPath = $location.path();
          $scope.currentPage = Site.pages.filter(function(e) {
            if (e.url === $scope.currentPath || e.url === $scope.currentPath.replace('/', '')) {
              return e.content;
            }
          })[0];
          $scope.versions = [];
        });
      });
    };
    getSite();

    // // Load Pages from Service and bind their Routes.        
    // $route.routes[''] = {
    //   keys: [],
    //   originalPath: '',
    //   redirectTo: '/',
    //   regexp: /^$/,
    // };
    // var i;
    // for (i=0; i<Site.pages.length; i++) {
    //   var page = Site.pages[i];
    //   var path = page.url;
    //   var RePath = new RegExp('^\\/'+path+'$');
    //   var originalPath = '/'+path;

    //   var keyPath = '';
    //   if (path === '/') {
    //     keyPath = path;
    //     RePath = new RegExp('^\\'+path+'$');
    //     originalPath = path;
    //   }
    //   else {
    //     keyPath = '/'+path;
    //   }

    //   $route.routes[keyPath] = {
    //     keys: [],
    //     originalPath: originalPath,
    //     regexp: RePath,
    //     reloadOnSearch: true,
    //     templateUrl: 'views/_page.html'
    //   };

    //   if (path !== '/') {
    //     RePath = new RegExp('^\\/'+path+'\\/'+'$');
    //     $route.routes[keyPath+'/'] = {
    //       keys: [],
    //       originalPath: originalPath+'/',
    //       regexp: RePath,
    //       reloadOnSearch: true,
    //       redirectTo: keyPath
    //     };
    //   }
    // }

    // /**
    //  * Events Listeners
    //  */
    // // When Route Change Success
    // $rootScope.$on('$routeChangeSuccess', function() {
    //   $scope.currentPath = $location.path();
    //   $scope.currentPage = Site.pages.filter(function(e) {
    //     if (e.url === $scope.currentPath || e.url === $scope.currentPath.replace('/', '')) {
    //       return e.content;
    //     }
    //   })[0];
    //   $scope.versions = [];
    // });

    

    /**
     * Function which verify if user is Authenticathed
     * If user is not authenticated then redirects to login view
     */
    // (function() {
    //   if ( !user.current() ) {
    //     $scope.bbcore.user.isLogin = false;
    //     $location.path('/auth');
    //   }
    // })();

    /**
     * Function that Creates a new user and redirect to main view
     */
    // $scope.SignUp = function() {
    //   console.log('::SignUp:');
    //   // Create a New User Object
    //   var user = new Parse.User();

    //   /**
    //    * Validate Inputs
    //    */
    //    if (!$scope.newUser.name) {
    //     $scope.showAlert('Missing user name', 'Please provide a valid user name.');
    //     return;
    //    }
    //    else if (!$scope.newUser.email) {
    //     $scope.showAlert('Missing E-mail', 'Please provide a valid e-mail.');
    //     return;
    //    }
    //    else if (!$scope.newUser.password) {
    //     $scope.showAlert('Missing password', 'Please provide a password.');
    //     return;
    //    }

    //   // Populated user with provided form data
    //   user.set('username', $scope.newUser.name);
    //   user.set('email', $scope.newUser.email);
    //   user.set('password', $scope.newUser.password);
    //   user.set('birthday', $scope.newUser.birthday);
    //   user.set('gender', $scope.newUser.gender);

    //   // Save new user data
    //   user.signUp(null).then(function(user) {
    //     $scope.newUser = {};
    //     $location.path('/');
    //     $scope.$apply();
    //   }, function(error) {
    //     $scope.showAlert('Error', error.message);
    //   });
    // };

    // Snapshot Current Site Changes
    $scope.bbcore.snapShot = function() {
      // $scope.versions.push($scope.beforeSite.pages);
      $scope.beforeSite = JSON.parse( JSON.stringify($scope.bbcore.site) );
      console.log('snapShot'+$scope.beforeSite);
    };

    // Update Changes Historial
    $scope.bbcore.updateHistorial = function() {
      if ($scope.versionIndex && $scope.versions) {
        $scope.versions = $scope.versions.slice(0, $scope.versionIndex);
        // $scope.$apply();
        // $scope.versionIndex = $scope.versions.length;
        // $scope.$apply();        
        // alert('indexVersion: '+$scope.versionIndex);
        // alert('versionsLenght: '+$scope.versions.length);
        // $scope.$apply();
      }
      // alert(JSON.stringify($scope.beforeSite.pages));
      if ($scope.beforeSite.pages) {
        $scope.$apply();
        $scope.versions.push($scope.beforeSite.pages);
        // $scope.versions.push($scope.bbcore.site.pages);
        $scope.beforeSite=[];

        $scope.versionIndex = $scope.versions.length;
        console.log('::versions:length: '+$scope.versions.length);
        console.log('::versionIndex:: '+$scope.versionIndex);
      }
    };

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
  .controller('MainCtrl', function ($scope, $route) {
    // Add Code
  });