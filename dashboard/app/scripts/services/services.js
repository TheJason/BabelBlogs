'use strict';

angular.module('dashboardApp')

/**
 * User
 */
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
    getName: function() {
      // Code Here!
    },
    isLogin: false,
    name: '',
  };
})



/**
 * Site
 */
.factory('Site', function($rootScope) {
  var Site = {
    // Function which creates a new site for the current user.
    addNewSite: function(siteTitle, siteDescription, siteUrl) {
      var Site = Parse.Object.extend('Site');
      var site  = new Site();
      var userId = Parse.User.current().id;

      site.set('title', siteTitle);
      site.set('userId', userId);
      // TODO: User promise
      site.save(null, {
			  success: function(site) {
			    // alert('New object created with objectId: ' + site.id);
			  },
			  error: function(site, error) {
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
    },
    sites: [],

    // Function which returns all the exiting sites for the current user.
    getAll: function() {
      if (Parse.User.current() ) {
        var userId = Parse.User.current().id;
        var query = new Parse.Query('Site');
        var sites = {};
        var parentObjt = this;

        query.equalTo('userId', userId);
        query.find().then(function(sites) {
          // alert(JSON.stringify(sites));
          sites = JSON.parse(JSON.stringify(sites));
          parentObjt.sites = sites;
          $rootScope.$apply();
          console.log('parentObjt: '+parentObjt.sites);
        },function(error) {
          alert(error.message);
        });
      }
      else {
        return false;
      }
    }
  };
  return Site;
});