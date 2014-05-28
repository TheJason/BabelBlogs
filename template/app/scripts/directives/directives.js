'use strict';

angular.module('babelBlogsApp')

/**
 * Main Navigation
 */
.directive('nguiNav', function($location) {
	return {
		link: function(scope, element, attrs, controller) {
			var currentLocation = $location.path();
			var currentLocationAnchor = "";

			if (currentLocation !== '/') {
				currentLocationAnchor = currentLocation.replace('/', '#');
			}
			else {
				currentLocationAnchor = currentLocation;
			}

			// Sets 'active' class to menu item that match the view url
			element.find('a[ng-href="' + currentLocationAnchor + '"]')
				.parent()
					.addClass('active');
		},
		templateUrl: 'scripts/directives/_nav.html',
		replace: true,
	};
});