'use strict';
/*jshint multistr: true */
angular.module('adminApp')


.factory('Site', ['$resource', function($resource) {
  return $resource('https://parse.com/1/classes/:className/:url',
    {className: 'Site', objectId: '@objectId'},
    {getSite: {method:'GET', headers: {'X-Parse-Application-Id': 'SJ00HRyBkPc30iFhTkn0Oopo3GymfYlnKpaecN3m', 'X-Parse-REST-API-Key': 'WM0mmNhkfSSA56OMSAW5sETAjp2TGKBeQctRwsKk'}}}
  );
}])


.factory('SiteLoader', ['Site', '$q',
  function(Site, $q) {
    return function() {
      var delay = $q.defer();
      Site.query(function(site) {
      delay.resolve(site);
    }, function() {
      delay.reject('Unable to fetch site');
    });
    return delay.promise;
  };
}])


.factory('User', ['$location', '$rootScope', function($location, $rootScope) {
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
    name: ''
  };
}]);