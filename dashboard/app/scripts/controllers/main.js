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
    
    user.logIn('magdiel.david@gmail.com', 'default').then(function(user) {
      $scope.user.isLogin = true;
      // Clear Form data
    
      // Redirect to main View if sign in success
      $location.path('/');
      $scope.$apply();
      
      // var currentUser = Parse.User.current();
      // console.log(currentUser);
      // var query = new Parse.Query('User');
      // query.equalTo('objectId', currentUser.id);
      // query.find().then(function(User) {
      //   alert(User.name);
      //   alert(JSON.stringify(User));
      // }, function(error) {
      //   alert(error);
      // });
      
    },function(error) {
      $scope.user.isLogin = false;
      alert('Error', error.message);
      // Clear password field when sign in fail
    });

    Site.getAll();
    $scope.addNewSite = function() {
      // Verify if Site is 
      // alert($scope.newSite.title);
      Site.addNewSite($scope.newSite.title);
    };   

    /**
     * Function which verify if user is Authenticathed
     * If user is authenticated then redirects to main view
     */
    (function() {
      if ( user.current() ) {
        $scope.user.isLogin = false;
        $location.path('/');
      }
    })();
  })



  /**
   * Billing Controller
   */
  .controller('BillingCtrl', function ($scope, $location, user) {
    // User Data
    $scope.user = user;

    /**
     * Function which verify if user is Authenticathed
     * If user is authenticated then redirects to main view
     */
    (function() {
      if ( user.current() ) {
        $scope.user.isLogin = false;
        $location.path('/');
      }
    })();
  });
