'use strict';
/*jshint multistr: true */
angular.module('adminApp')

.factory('Site', function($location, $rootScope) {
  return {
    siteId: ''
  };
})

.factory('user', function($location, $rootScope) {
  return {
    logIn: function(username, password) {
      $rootScope.$broadcast('event:sessionUpdated');
      return Parse.User.logIn(username, password);
    },
    logOut: function() {
      Parse.User.logOut();
      $rootScope.$broadcast('event:sessionUpdated');
      this.isLogin = false;
    },
    current: function() {
      return Parse.User.current();
    },
    isAuthenticated: function() {
      if ( Parse.User.current() ) {
        this.isLogin = true;
        return true;
      }
      else {
        this.isLogin = false;
        return false;
      }
    },
    isLogin: false,
  };
});