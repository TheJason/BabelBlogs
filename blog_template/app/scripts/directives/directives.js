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
// .directive('bbContent', function($rootScope, $location, $route, Site) {
// 	return {
// 		restrict: 'A',
// 		scope: false,
// 		link: function(scope, element) {
// 			var modalID = '#WYSIWYGModal';
// 			var editorID = 'editor1';
// 			var loadEditor = function() {
// 				CKEDITOR.replace( 'editor1', {
// 					allowedContent: true
// 				});
// 			};

// 			// Edit Rich Text on Click
// 			// element.on('click', '*[bb-rich-text]', function() {
// 			// 	scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );
// 			// 	scope.richTextEditing = element.find('*[ng-bind-html]').html();
// 			// 	scope.$apply();
// 			// 	// editor.setData();
// 			// 	if (!CKEDITOR.instances[editorID]) {
// 			// 		loadEditor();
// 			// 	}
// 			// 	else {
// 			// 		editor.destroy();
// 			// 		loadEditor();
// 			// 	}
// 			// 	$(modalID).modal('show');
// 			// });

// 			// Apply Rich Text Changes
// 			element.on('click', '*[data-apply]', function(event) {
// 				var pageID = scope.currentPage[0].id;
// 				var editor = CKEDITOR.instances[editorID];
// 				element.find('*[bb-rich-text]').html(scope.richTextEditing);
// 				Site.pages[pageID].content = editor.getData();
// 				scope.$apply();
// 				// editor.destroy();
// 				$(modalID).modal('hide');
// 			});

// 			// Close Modal
// 			element.on('click', '*[data-dismiss]', function(event) {
// 				// editor.destroy();
// 				$(modalID).modal('hide');
// 			});

// 			// Event Listener
// 			$rootScope.$on('$routeChangeSuccess', function() {
// 				// editor.destroy();
// 				console.log(CKEDITOR.instances[editorID]);
// 	    });
// 		},
// 		// templateUrl: 'scripts/directives/_toolbar.html',
// 		// replace: true,
// 		// transclude: false
// 	};
// })

.directive('bbContent', function($location, $route, Site) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element) {
			var contentEl = $(this);
			var modalID = '#WYSIWYGModal';
			var editorID = 'editor1';
			var loadEditor = function() {
				CKEDITOR.replace( 'editor1', {
					allowedContent: true
				});
			};

			// Show text editor
			element.on('dblclick', '*[bb-rich-text]', function() {
				scope.$apply();
				var richTextID = $(this).attr('id');
				console.log('richTextID: '+richTextID);
				scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );
				scope.richTextEditing = $(this).html();
				console.log('richTextEditing: '+scope.richTextEditing);

				if (!CKEDITOR.instances[editorID]) {
					loadEditor();
				}
				else {
					CKEDITOR.instances[editorID].destroy();
					loadEditor();
				}
				var editor = CKEDITOR.instances[editorID];
				editor.setData(scope.richTextEditing);
				console.log('getData: '+editor.getData());
				$(modalID).modal('show');

				// Apply Rich Text Changes
				$(modalID).on('click', '*[data-apply]', function(event) {
					console.log('Applying...');
					var pageID = scope.currentPage[0].id;
					var editor = CKEDITOR.instances[editorID];
					element.find('#'+richTextID).html(editor.getData());
					console.log('Applying:getData: '+editor.getData());
					var newContent = $('#content *[ng-bind-html]').html();
					console.log('newContent: '+newContent);
					// alert(newContent);
					scope.site.pages[pageID].content = newContent;
					scope.$apply();
					editor.destroy();
					$(modalID).modal('hide');
				});

				// Remove Rich Text
				$(modalID).on('click', '*[data-remove]', function(event) {
					var pageID = scope.currentPage[0].id;
					var newContent = $('#content *[ng-bind-html]').html();
					element.find('#'+richTextID).remove();
					scope.site.pages[pageID].content = newContent;
					scope.$apply();
					editor.destroy();
					$(modalID).modal('hide');
				});

				// Close Modal
				element.on('click', '*[data-dismiss]', function(event) {
					editor.destroy();
					$('#pageSettingsModal').modal('hide');
				});

			});
		},
		replace: false,
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
			// Toggle Option List
			element.on('click', 'li', function(event) {
				var id = $(this).data('id');
				// $(id).toggle("slow");
				$(id).toggleClass('hide');
				updatePageList();
			});


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

			// Dialog for Add New Page
			element.on('click', 'li[data-page-add]', function(event) {
				var modalID = '#AddPageModal';
				$(modalID).modal('show');

				$(modalID).on('click', '*[data-apply]', function(event) {
					var title = scope.NewPage.title;
					var url = title.split(' ').join('-').toLowerCase();
					var newPage = scope.bbcore.addPage(title, url, '<div id="bb-rich-text1" bb-element bb-rich-text><p>Double click here in order to edit this paragraph</p></div>');
					$location.path((newPage.url));
					scope.$apply();
					$(modalID).modal('hide');
				});
			});

			// Show Page Editor for selected page
			element.on('click', 'li *[data-page-id]', function(event) {
				var modalID = '#pageSettingsModal';
				var pageID = $(this).data('page-id');
				scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );

				scope.PageEditing = scope.site.pages[pageID];
				$location.path(scope.PageEditing.url);
				scope.$apply();
				$(modalID).modal('show');

				// Remove Page
				$(modalID).on('click', '*[data-remove]', function(event) {
					var pageID = scope.PageEditing.id;
					scope.site.pages.splice(pageID, 1);
					scope.PageEditing = {};
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Close Modal
				$(modalID).on('click', '*[data-dismiss]', function(event) {
					scope.site = scope.beforeSite = JSON.parse( JSON.stringify(scope.beforeSite) );
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Apply Changes
				$(modalID).on('click', '*[data-apply]', function(event) {
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

					$(modalID).modal('hide');
				});
			});
			


			/**
			 * Design
			 */


			/**
			 * Insert
			 */
			// Insert Text
			element.on('click', '*[data-insert-text]', function(event) {
				var richTextCount = $('*[bb-rich-text]').length;
				// console.log(richTextCount.length);
				var left = 460+(richTextCount*32);
				var top = 120+(richTextCount*32);
				richTextCount+=1;
				$('#content *[ng-bind-html]').append($('<div id="bb-rich-text'+richTextCount+'"'+' bb-element bb-rich-text style="left:'+left+'px; '+'top:'+top+'px; position:absolute"><p jqyoui-draggable="{data-drag: \'true\'}">I\'m a paragraph, double click here in order to add<br/>your own text.</p></div>') );
				// scope.$apply();
			});


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