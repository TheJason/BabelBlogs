'use strict';

angular.module('babelBlogsApp')

/**
 * Main Navigation
 */
.directive('nguiNav', function($location) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var currentLocation = $location.path();
			var currentLocationAnchor = '';

			if (currentLocation !== '/') {
				currentLocationAnchor = currentLocation.replace('/', '#');
			}
			else {
				currentLocationAnchor = currentLocation;
			}

			// Add 'active' class to menu item that match the view url
			element.find('a[ng-href="' + currentLocationAnchor + '"]')
				.parent()
					.addClass('active');
		},
		templateUrl: 'scripts/directives/_nav.html',
		replace: true,
	};
})


/**
 * Push Right Menu
 */
.directive('nguiPushMenu', function($rootScope, $location) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var setCurrentItem = function () {
				var currentLocation = $location.path();
				var currentLocationAnchor = '';

				if (currentLocation !== '/') {
					currentLocationAnchor = currentLocation.replace('/', '#');
				}
				else {
					currentLocationAnchor = currentLocation;
				}
				// Add 'active' class to menu item that match the view url
				element.find('li')
					  .removeClass('active');

				element.find('a[ng-href="' + currentLocationAnchor + '"]')
					.parent()
						.addClass('active');
		  };
		  setCurrentItem();

			$rootScope.$on('$routeChangeStart', function(event, next) {
	      if (next.originalPath === '/' && next.redirectTo === '/') {
	        // Do Something
	      }
	      else {
	        setCurrentItem();
	      }
	    });
		},
		templateUrl: 'scripts/directives/_push_right_menu.html',
		replace: true,
	};
});