'use strict';

/**
 * Main Controller
 */
angular.module('dashboardApp')
  .controller('MainCtrl', function ($scope, $location, user, Site) {
    // User Data
    $scope.user = user;

    // Site Service
    $scope.site = Site;

    /**
     * Function which verify if user is Authenticathed
     * If user is not authenticated then redirects to login view
     */
    (function() {
      if ( !user.current() ) {
        $scope.user.isLogin = false;
        $location.path('/sign-in');
      }
      else {
        $scope.user.isLogin = true;

        // Load Existing WebSites by the current user.
        Site.getAll();

        // Function which creates a new website
        $scope.addNewSite = function() {
          // Verify if Site is 
          // alert($scope.newSite.title);
          Site.addNewSite($scope.newSite.title);
          // $scope.location.path('/');
          window.location.href = '/';
        };
      }
    })();
  })



  /**
  * Sign In Controller
  */
  .controller('SignInCtrl', ['$scope', '$location', 'user',
    function($scope, $location, user) {
      // User Data
      $scope.user = user;

      /**
       * Function which verify if user is Authenticathed
       * If user is authenticated then redirects to main view
       */
      (function() {
        if ( user.current() ) {
          $scope.user.isLogin = true;
          $location.path('/');
          // alert('You are currently logged');
        }
      })();


      // Function that Create a Session if username and password are valid.
      $scope.SignIn = function() {
        if ( !user.current() ) {
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
          user.logIn($scope.login.name, $scope.login.password).then(function(user) {
            $scope.user.isLogin = true;
            // Clear Form data
            $scope.login.password = '';
            $scope.login.name = '';

            // Redirect to main View if sign in success
            $location.path('/');
            $scope.$apply();
          },function(error) {
            $scope.user.isLogin = false;
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
  .controller('LogOutCtrl', function ($scope, $location, user) {
      // User Data
      $scope.user = user;

      // console.log('user:'+JSON.stringify($scope.user));
      console.log('user:'+JSON.stringify(user));

      // Logout current user
      $scope.user.logOut();

      // Redirect to Main view
      $location.path('/login');
      $scope.hide();
    }
  )



  /**
   * Billing Controller
   */
  .controller('BillingCtrl', function ($scope, $location, user) {
    // User Data
    $scope.user = user;
  })



  /**
   * Settings Controller
   */
  .controller('SettingsCtrl', function ($scope, $location, user) {
    // User Data
    $scope.user = user;
  });
