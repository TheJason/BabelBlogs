'use strict';

angular.module('adminApp')
  /**
   * BabelBlogs Core Controller
   */
  .controller('BBCoreCtrl', function ($sce, $rootScope, $scope, $route, $routeParams, $location, User, Site) {
    $scope.bbcore = {};
    $scope.bbcore.user = User;
    $scope.bbcore.edit = true;
    $scope.bbcore.selectedElement = '';
    
    /**
     * Function which verify if user is Authenticathed
     * If user is not authenticated then redirects to login view
     */
    (function() {
      if ( !User.current() ) {
        $scope.bbcore.user.isLogin = false;
        $location.path('/sign-in');
      }
      else {
        $scope.bbcore.user.isLogin = true;
        $scope.bbcore.user.name = User.current().get('username');
      }
    })();

    // (function() {
    //   $scope.sites = Site.getSite({objectId: 'NRSf2INwJn'});
    //   $scope.sites.$promise.then(function(result) {
    //     // console.log('result:' + result.schema );
    //     $scope.bbcore.site = JSON.parse(result.schema);
    //   }, function(error) {
    //     console.log('error:' + JSON.stringify(error) );
    //   });
    // })();


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
    
    // var getSite = function() {
    //   var query = new Parse.Query('Site');
    //   var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
    //   query.equalTo('url', 'bizblog');
    //   query.find().then(function(site) {
    //     var Site = JSON.parse(site[0].get('schema'));
    //     console.log( 'Schema'+JSON.parse(site[0].get('schema') ) );
    //     $scope.bbcore.site = JSON.parse(site[0].get('schema') );
    //     $scope.bbcore.siteQuery = site;
    //     $scope.$apply();
    //     Site.siteId = site[0].id;
    //     // alert('Site.siteId: '+Site.siteId);
    //     $scope.bbcore.siteId = Site.siteId;
    //     return $scope.bbcore.site;
    //   }, function(error) {
    //     alert(error);
    //   });
    // };
    // getSite();
  })
  


  /**
  * Sign In Controller
  */
  .controller('SignInCtrl', ['$scope', '$location', 'User',
    function($scope, $location, User) {
      // User Data
      $scope.bbcore.user = User;

      /**
       * Function which verify if user is Authenticathed
       * If user is authenticated then redirects to main view
       */
      (function() {
        if ( User.current() ) {
          $scope.bbcore.user.isLogin = true;
          $location.path('/');
          // alert('You are currently logged');
        }
      })();


      // Function that Create a Session if username and password are valid.
      $scope.SignIn = function() {
        if ( !User.current() ) {
          /**
           * Validate Inputs
           */
          // Check if the username is provided
          if (!$scope.login.name) {
            alert('Missing User Name', 'Please provide a valid user name.');
            $scope.hide();
            return;
          }
          else if (!$scope.login.password) {
            alert('Missing Password', 'Please provide a password.');
            $scope.hide();
            return;
          }

          /**
           * Try to log in
           */
          User.logIn($scope.login.name, $scope.login.password).then(function(user) {
            $scope.bbcore.user.isLogin = true;
            // Clear Form data
            $scope.login.password = '';
            $scope.login.name = '';

            // Redirect to main View if sign in success
            $location.path('/');
          },function(error) {
            $scope.bbcore.user.isLogin = false;
            alert('Error', error.message);
            // Clear password field when sign in fail
            $scope.login.password = '';
          });
        }
        else {
          // Redirect to main View if the user is currently loged
          $location.path('/');
        }
      };
    }
  ])



  /**
   * Log Out Controller
   */
  .controller('LogOutCtrl', ['$scope', '$location', 'User',
    function ($scope, $location, User) {
      // User Data
      $scope.bbcore.user = User;

      // Logout current user
      $scope.bbcore.user.logOut();

      // Redirect to Main view
      $location.path('/sign-in');
    }
  ])



  /**
   * Main Controller
   */
  .controller('MainCtrl', function ($scope) {
   
  })



  /**
   * Post List Controler
   */
  .controller('PostsCtrl', ['$scope', 'schema', function ($scope, schema) {
    $scope.bbcore.site = schema;
  }])



  /**
   * Page List Controler
   */
  .controller('PagesCtrl', ['$scope', 'schema', function ($scope, schema) {
    $scope.bbcore.site = schema;
  }])



  /**
   * Post Edition
   */
  .controller('PostEditionCtrl', ['$rootScope', '$scope', '$routeParams', 'schema', function ($rootScope, $scope, $routeParams, schema) {
    $scope.bbcore.site = schema;

    // Retrieve current post
    var postId = $routeParams.id;
    $scope.bbcore.currentPost = $scope.bbcore.site.posts.filter(function(e) { if (e.postId == postId) {return e;} });
    $scope.bbcore.currentPost = $scope.bbcore.currentPost[0];
    /*
    $scope.sites = Site.getSite({objectId: 'NRSf2INwJn'});
    $scope.sites.$promise.then(function(result) {
      // console.log('result:' + result.schema );
      $scope.bbcore.site = JSON.parse(result.schema);

      var postId = $routeParams.id;
      $scope.bbcore.currentPost = $scope.bbcore.site.posts.filter(function(e) { if (e.postId == postId) {return e;} });
      $scope.bbcore.currentPost = $scope.bbcore.currentPost[0];
    }, function(error) {
      console.log('error:' + JSON.stringify(error) );
    });
    */

    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        // console.log( 'Schema' + JSON.parse(site[0].get('schema') ) );
        // $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        $scope.bbcore.siteQuery = site;
        // $scope.$apply();

        // // Retrieve siteId
        // Site.siteId = site[0].id;
        // $scope.bbcore.siteId = Site.siteId;
        // $scope.siteId = Site.siteId;
        // var siteId = $scope.bbcore.siteId;
        // var postId = $routeParams.id;
        // console.log('Site.siteId: '+ Site.siteId);

        // // Retrieve currentPost
        // if ($scope.bbcore.site.posts) {
        //   $scope.bbcore.currentPost = $scope.bbcore.site.posts.filter(function(e) { if (e.postId == postId) {return e;} });
        //   $scope.bbcore.currentPost = $scope.bbcore.currentPost[0];
        // }
        // else {
        //   $scope.bbcore.site.posts = [];
        // }
                
        // $scope.$apply();
        // if ($scope.bbcore.currentPost) {
        //   $rootScope.$broadcast('loadedContent', $scope.bbcore.currentPost.content);
        // }
        // else {
        //   $rootScope.$broadcast('loadedContent');
        //   // Do Something
        // }
        
      }, function(error) {
        alert(error.message);
      });
    };
    getSite();
  }])



  /**
   * Page Edition
   */
  .controller('PageEditionCtrl', ['$rootScope', '$scope', '$routeParams', 'schema', function ($rootScope, $scope, $routeParams, schema) {
    $scope.bbcore.site = schema;

    // Retrieve current page
    var pageId = $routeParams.id;
    $scope.bbcore.currentPage = $scope.bbcore.site.pages.filter(function(e) { if (e.pageId == pageId) {return e;} })[0];
    
    
    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        var Site = JSON.parse(site[0].get('schema'));
        // console.log( 'Schema' + JSON.parse(site[0].get('schema') ) );
        $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        $scope.bbcore.siteQuery = site;
        $scope.$apply();

        // Retrieve siteId
        // Site.siteId = site[0].id;
        // $scope.bbcore.siteId = Site.siteId;
        // $scope.siteId = Site.siteId;
        // var siteId = $scope.bbcore.siteId;
        // var pageId = $routeParams.id;
        // console.log('Site.siteId: '+ Site.siteId);

        // // Retrieve currentPage
        // $scope.bbcore.currentPage = $scope.bbcore.site.pages.filter(function(e) { if (e.pageId == pageId) {return e;} });
        // $scope.bbcore.currentPage = $scope.bbcore.currentPage[0];
        // // alert(JSON.stringify($scope.bbcore.currentPage));
        // $scope.$apply();
        // if ($scope.bbcore.currentPage) {
        //   $rootScope.$broadcast('loadedContent', $scope.bbcore.currentPage.content);
        // }
        // else {
        //   $rootScope.$broadcast('loadedContent');
        //   // Do Something
        // }
        
      }, function(error) {
        alert(error.message);
      });
    };
    getSite();

    // $scope.bbcore.saveSite = function() {
    //   console.log(JSON.stringify($scope.bbcore.site));
    //   // Do Something
    // };
    
  }])

  .controller('SeoCtrl', function ($scope) {
    
  })

  .controller('SettingsCtrl', ['$scope', 'schema', function($scope, schema) {
    $scope.bbcore.site = schema;

    var getSite = function() {
      var query = new Parse.Query('Site');
      var siteUrl = window.location.origin.replace(/http(s)?:\/\//g, '').split('.')[0];
      query.equalTo('url', siteUrl);
      query.find().then(function(site) {
        // var Site = JSON.parse(site[0].get('schema'));
        // $scope.bbcore.site = JSON.parse(site[0].get('schema') );
        $scope.bbcore.siteQuery = site;
        $scope.$apply();
      }, function(error) {
        alert(error.message);
      });
    };
    getSite();

  }]);
