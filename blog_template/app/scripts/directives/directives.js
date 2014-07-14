'use strict';

angular.module('blogTemplateApp')

.directive('compileHtml', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.compileHtml, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
})

/**
 * BabelBlogs Elements
 */
// .directive('bbElement', function() {
// 	return {
// 		restrict: 'A',
// 		scope: false,
// 		link: function(scope, element) {
// 			element.click(function() {
// 				element.attr('draggable');
// 				if (element.attr('draggable')) {
// 					element.removeAttr('draggable');
// 				}
// 				else {
// 					element.attr('draggable','');
// 				}
// 				var pageID = scope.currentPage.id;
// 				var newContent = $('#content *[compile-html]').html();
// 				scope.site.pages[pageID].content = newContent;
// 				scope.$apply();
// 			});
// 		}
// 	};
// })

/**
 * Content
 */
.directive('bbContent', function($compile, $document, $location, $route, Site) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			var contentEl = $(this);
			var modalID = '#WYSIWYGModal';
			var editorID = 'editor1';
			var loadEditor = function() {
				CKEDITOR.replace( 'editor1', {
					allowedContent: true
				});
			};

			// Clicks
			element.on('click', '*[bb-element]', function() {
				element.find('*[bb-element]').removeAttr('draggable');
				if ($(this).attr('draggable')) {
					$(this).removeAttr('draggable');
				}
				else {
					$(this).attr('draggable','');
				}
				var pageID = scope.currentPage.id;
				var newContent = $('#content *[compile-html]').html();
				scope.site.pages[pageID].content = newContent;
				scope.$apply();
			});

			// Show Text Editor
      element.on('dblclick', '*[bb-rich-text]', function() {
				// scope.$apply();
				var richTextID = $(this).attr('id');
				// console.log('richTextID: '+richTextID);
				// scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );
				scope.bbcore.snapShot();

				scope.richTextEditing = $(this).html();
				// console.log('richTextEditing: '+scope.richTextEditing);

				if (!CKEDITOR.instances[editorID]) {
					loadEditor();
				}
				else {
					CKEDITOR.instances[editorID].destroy();
					loadEditor();
				}
				var editor = CKEDITOR.instances[editorID];
				editor.setData(scope.richTextEditing);
				// console.log('getData: '+editor.getData());
				$(modalID).modal('show');

				// Apply Rich Text Changes
				$(modalID).on('click', '*[data-apply]', function() {
          var editor = CKEDITOR.instances[editorID];
          if (editor){
            element.find('#'+richTextID).html(editor.getData());
            editor.destroy();
          }
					var pageID = scope.currentPage.id;					
					var newContent = $('#content *[compile-html]').html();
					scope.site.pages[pageID].content = newContent;
					scope.$apply();
					scope.bbcore.updateHistorial();
					$(modalID).modal('hide');
				});

				// Remove Rich Text
				$(modalID).on('click', '*[data-remove]', function() {
					var pageID = scope.currentPage.id;
					var newContent = $('#content *[compile-html]').html();
					element.find('#'+richTextID).remove();
					scope.site.pages[pageID].content = newContent;
					scope.$apply();
					editor.destroy();
					$(modalID).modal('hide');
				});

				// Close Modal
				element.on('click', '*[data-dismiss]', function() {
					editor.destroy();
					$('#pageSettingsModal').modal('hide');
				});
			});
		},
		replace: false,
	};
})

/**
 * Draggable Elements
 */
.directive('draggable', function($document) {
  return function(scope, element, attr) {
    var startX = 0, startY = 0, x = 0, y = 0;
    element.css({
      position: 'relative',
      border: '1px dashed red',
      cursor: 'move'
    });
    
    element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      scope.$apply();
      event.preventDefault();
      startX = event.screenX - x;
      startY = event.screenY - y;
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    element.on('mouseup', function(event) {
   //    alert('Element Drop');
      var pageID = scope.currentPage.id;
			var newContent = $('#content *[compile-html]').html();
			scope.site.pages[pageID].content = newContent;
			scope.$apply();
    });

    function mousemove(event) {
      y = event.screenY - startY;
      x = event.screenX - startX;
      element.css({
        top: y + 'px',
        left:  x + 'px'
      });
    }

    function mouseup() {
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
    }
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
			// Undo Changes
			element.on('click', '*[data-undo]', function() {
				if (scope.bbcore.edit === true && scope.versions.length) {
					var pageID = scope.currentPage.id;

					if (scope.versionIndex > 0) {
						scope.site.pages = scope.versions[scope.versionIndex-1];
						scope.versionIndex = scope.versionIndex-1;
					}
					else {
						// Disable Button
					}
					scope.currentPage = scope.site.pages.filter(function(e){if(e.id === pageID){return e;}})[0];
					scope.$apply();
				}
				else {
					// Disable Button
				}
			});

			// Repeat Changes data-repeat
			element.on('click', '*[data-repeat]', function() {
				if (scope.bbcore.edit === true && scope.versions.length) {
					var pageID = scope.currentPage.id;
					if (scope.versionIndex+1 < scope.versions.length) {
					  scope.site.pages = scope.versions[scope.versionIndex+1];
						// scope.$apply();
						scope.versionIndex = scope.versionIndex+1;
					}
					else {
						// Disable Button
					}
					scope.currentPage = scope.site.pages.filter(function(e){if(e.id === pageID){return e;}})[0];
					scope.$apply();
				}
				else {
					// Disable Button
				}
			});

			// Save Page
			element.on('click', '*[data-save]', function() {
				localStorage.bbSite01 = JSON.stringify(scope.site);
				scope.$apply();
				// $route.reload(); ?$location?
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
			element.on('click', 'li', function() {
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
			element.on('click', 'li[data-page-add]', function() {
				var modalID = '#AddPageModal';
				$(modalID).modal('show');

				$(modalID).on('click', '*[data-apply]', function() {
					var title = scope.NewPage.title;
					var url = title.split(' ').join('-').toLowerCase();
					var newPage = scope.bbcore.addPage(title, url, '<div id="bb-rich-text1" bb-element bb-rich-text><p>Double click here in order to edit this paragraph</p></div>');
					$location.path((newPage.url));
					scope.$apply();
					$(modalID).modal('hide');
				});
			});

			// Show Page Editor for selected page
			element.on('click', 'li *[data-page-id]', function() {
				var modalID = '#pageSettingsModal';
				var pageID = $(this).data('page-id');
				scope.beforeSite = JSON.parse( JSON.stringify(scope.site) );

				scope.PageEditing = scope.site.pages[pageID];
				$location.path(scope.PageEditing.url);
				scope.$apply();
				$(modalID).modal('show');

				// Remove Page
				$(modalID).on('click', '*[data-remove]', function() {
					var pageID = scope.PageEditing.id;
					scope.site.pages.splice(pageID, 1);
					scope.PageEditing = {};
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Close Modal
				$(modalID).on('click', '*[data-dismiss]', function() {
					scope.site = scope.beforeSite = JSON.parse( JSON.stringify(scope.beforeSite) );
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Apply Changes
				$(modalID).on('click', '*[data-apply]', function() {
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
			element.on('click', '*[data-insert-text]', function() {
				var richTextCount = $('*[bb-rich-text]').length;
				// console.log(richTextCount.length);
				var left = 460+(richTextCount*32);
				var top = 120+(richTextCount*32);
				richTextCount+=1;
				$('#content *[compile-html]').append($('<div id="bb-rich-text'+richTextCount+'"'+' bb-element bb-rich-text style="left:'+left+'px; '+'top:'+top+'px; position:absolute"><p jqyoui-draggable="{data-drag: \'true\'}">I\'m a paragraph, double click here in order to add<br/>your own text.</p></div>') );
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

;