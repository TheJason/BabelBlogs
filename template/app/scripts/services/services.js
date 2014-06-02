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
});