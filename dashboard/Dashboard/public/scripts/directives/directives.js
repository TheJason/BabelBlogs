'use strict';

angular.module('dashboardApp')

/**
 * Main Navigation
 */
.directive('bbDashboardNav', function($location) {
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
			element.find('button[data-href="' + currentLocationAnchor + '"]')
				.addClass('active');

      element.on('click', 'button', function(event) {
        var path = $(this).data('href');
        window.location.href = path;
      });
		},
		templateUrl: 'scripts/directives/nav.html',
		replace: true,
	};
});