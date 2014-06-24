'use strict';

angular.module('blogTemplateApp')

/**
 * Main Navigation

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
 */

/**
 * Content
 */
.directive('bbContent', function($rootScope, $location, $route, Site) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element) {
			// Edit Rich Text
			element.on('click', '*[bb-rich-text]', function() {
				// console.log($(this));
				var pageID = scope.currentPage[0].id;
				scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );

				// console.log('pageID: ' + pageID);
				// console.log($(this).html());
				// console.log($(this).text());
				// $(this).text('You just entered new text :-)');
				// $(this).html($('<input value="'+$(this).text()+'">'));
				// console.log(element.find('*[ng-bind-html]').html());				
				scope.richTextEditing = element.find('*[ng-bind-html]').html();
				scope.$apply();
				$('#WYSIWYGModal').modal('show');
			});

			// Apply Rich Text Changes
			element.on('click', '*[data-apply]', function(event) {
				var pageID = scope.currentPage[0].id;
				element.find('*[bb-rich-text]').html(scope.richTextEditing);
				Site.pages[pageID].content = element.find('*[ng-bind-html]').html();
				scope.$apply();
				$('#WYSIWYGModal').modal('hide');
			});
		},
		// templateUrl: 'scripts/directives/_toolbar.html',
		// replace: true,
		// transclude: false
	};
})

/**
 * ToolBar
 */
.directive('bbToolBar', function($location, $route, Site) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element) {

			// Save Page
			element.on('click', '*[data-save]', function(event) {
				localStorage.bbSite01 = JSON.stringify(Site);
				scope.$apply();
				$route.reload();
				$('#pageSettingsModal').modal('hide');
			});
		},
		templateUrl: 'scripts/directives/_toolbar.html',
		replace: true,
		transclude: false
	};
})


/**
 * ToolBox
 */
.directive('bbToolBox', function($rootScope, $location, $route, Site) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element) {
			/**
			 * Pages
			 */
			var updatePageList = function() {
				var currentLocation = $location.path();
				var currentLocationAnchor = '';

				if (currentLocation !== '/') {
					currentLocationAnchor = currentLocation.replace('/', '#');
				}
				else {
					currentLocationAnchor = currentLocation;
				}
				element.find('#page-list li a[ng-href]')
					.parent()
						.removeClass('active');

				element.find('#page-list li a[ng-href="' + currentLocationAnchor + '"]')
					.parent()
						.addClass('active');
			};
			updatePageList();

			$rootScope.$on('$routeChangeSuccess', function() {
				updatePageList();
	    });

			// Toggle Page List
			element.on('click', 'li', function(event) {
				var id = $(this).data('id');
				// $(id).toggle("slow");
				$(id).toggleClass('hide');
				updatePageList();
			});

			// Add New Page
			element.on('click', 'li *[data-page-add]', function(event) {
				// var pageID = $(this).data('page-add');
				scope.PageEditing = {};
				// scope.$apply();
				$('#pageSettingsModal').modal('show');
			});

			// Show Page Editor for selected page
			element.on('click', 'li *[data-page-id]', function(event) {
				var pageID = $(this).data('page-id');
				scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );

				scope.PageEditing = scope.site.pages[pageID];
				scope.$apply();
				$('#pageSettingsModal').modal('show');
			});

			// Remove Page
			element.on('click', '*[data-remove]', function(event) {
				var pageID = scope.PageEditing.id;
				scope.site.pages.splice(pageID, 1);
				scope.PageEditing = {};
				scope.$apply();
				$('#pageSettingsModal').modal('hide');
			});

			// Close Modal
			element.on('click', '*[data-dismiss]', function(event) {
				scope.site = scope.beforeSite = JSON.parse( JSON.stringify(scope.beforeSite) );
				scope.$apply();
				$('#pageSettingsModal').modal('hide');
			});

			// Apply Changes
			element.on('click', '*[data-apply]', function(event) {
				var priorUrl = (scope.beforeSite.pages[scope.PageEditing.id]).url;
				var newUrl  = scope.PageEditing.url;
				var newRoute = $route.routes['/'+priorUrl+'/'];
				var RePath = new RegExp('^\/'+newUrl+'$');

				newRoute.originalPath = '/'+newUrl;
				newRoute.regexp = RePath;
				$route.routes['/'+newUrl+'/'] = newRoute;
				delete $route.routes['/'+priorUrl+'/'];
				
				scope.$apply();
				$route.reload();

				$('#pageSettingsModal').modal('hide');
			});


			/**
			 * Design
			 */


			/**
			 * Insert
			 */


			/**
			 * Widgets
			 */


			/**
			 * Settings
			 */
		},
		templateUrl: 'scripts/directives/_toolbox.html',
		replace: true,
		transclude: false
	};
})
;