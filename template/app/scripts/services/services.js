'use strict';

angular.module('babelBlogsApp')

.factory('ui', function () {
	return {showMenu: false, homePage: true };
})


.factory('blogPosts', function () {
	var lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod<br/>tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,<br/> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo<br/>	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse<br/>cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non<br/>proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	return {
		articles: [
			{
				id: 0,
				author: 'Christian H.',
			  title: 'New features in BabelBlog core.',
			  content: lorem, // ToDo: Support HTML tags
			  pub_date: '2013-12-31',
			  updated: '2013-12-31'
			},
			{
				id: 1,
				author: 'Joe C.',
			  title: 'New features in BabelBlog core.',
			  content: lorem, // ToDo: Support HTML tags
			  pub_date: '2013-12-31',
			  updated: '2013-12-31'
			},
			{
				id: 2,
				author: 'Amanda L.',
			  title: 'New features in BabelBlog core.',
			  content: lorem, // ToDo: Support HTML tags
			  pub_date: '2013-12-31',
			  updated: '2013-12-31'
			},
	  ]
	};
})

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
    isLogin: false,
  };
});