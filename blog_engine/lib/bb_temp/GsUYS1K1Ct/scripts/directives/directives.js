'use strict';

var generateUid = function (separator) {
  /// <summary>
  ///    Creates a unique id for identification purposes.
  /// </summary>
  /// <param name="separator" type="String" optional="true">
  /// The optional separator for grouping the generated segmants: default "-".    
  /// </param>

  var delim = separator || "-";

  function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};

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
// 				var pageId = scope.currentPage.pageId;
// 				var newContent = $('#content *[compile-html]').html();
// 				scope.bbcore.site.pages[pageId].content = newContent;
// 				scope.$apply();
// 			});
// 		}
// 	};
// })

/**
 * Content
 */
.directive('bbContent', function($compile, $document, $rootScope, $location, $route, Site) {
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

      var removeEditionAttributes = function() {
        element.find('*')
          .removeAttr('draggable');
        var pageId = scope.currentPage.pageId;
        var newContent = $('#content *[compile-html]').html();
        scope.bbcore.site.pages[pageId].content = newContent;
        // scope.$apply();
      };

      // Event Handler
      $rootScope.$on('$routeChangeStart', function() {
        removeEditionAttributes();
      });

			// Clicks
			element.on('click', '*', function() {
				var unFocusComponents = function() {
					element.find('*[draggable]')
						.removeAttr('draggable');
				};

				if ($(this).attr('bb-element')) {
					console.log('isComponent');
					console.log($(this));
					// var bbElement = $(this).attr('bb-element');
					// element.find('*[bb-element]').removeAttr('draggable');
					// if ($(this).attr('draggable')) {
					// 	console.log('if');
					// 	$(this).removeAttr('draggable');
					// }
					// else {
					// 	console.log('else');
					// 	$(this).attr('draggable','');
					// }
					// unFocusComponents();
					$(this).attr('draggable','');
				}
				else {
					// console.log('isNotComponent');
					// console.log($(this));
					// $(this).removeAttr('draggable');
				}
				// if ($(this).attr('bb-element')) {
				// 	console.log('isComponent');
				// 	console.log($(this));
				// 	// var bbElement = $(this).attr('bb-element');
				// 	// element.find('*[bb-element]').removeAttr('draggable');
				// 	if ($(this).attr('draggable')) {
				// 		$(this).removeAttr('draggable');
				// 	}
				// 	else {
				// 		$(this).attr('draggable','');
				// 	}
				// }
				// else {
				// 	console.log('isNotComponent: ', $(this).attr('bb-element'));
				// 	console.log($(this));
				// 	var allChildren = element.find('*');
				// 	allChildren.removeAttr('draggable');
				// 	// $.each(allChildren, function(index, value) {value.hide();});
				// }
				var pageId = scope.currentPage.pageId;
				var newContent = $('#content *[compile-html]').html();
				scope.bbcore.site.pages[pageId].content = newContent;
				scope.$apply();
			});

			// Show Text Editor
      element.on('dblclick', '*[bb-element="bb-rich-text"]', function() {
				// scope.$apply();
				var richTextID = $(this).attr('id');
				// console.log('richTextID: '+richTextID);
				// scope.beforeSite = JSON.parse( JSON.stringify(scope.bbcore.site) );
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
					var pageId = scope.currentPage.pageId;
					var newContent = $('#content *[compile-html]').html();
					scope.bbcore.site.pages[pageId].content = newContent;
					scope.$apply();
					scope.bbcore.updateHistorial();
					$(modalID).modal('hide');
				});

				// Remove Rich Text
				$(modalID).on('click', '*[data-remove]', function() {
					var pageId = scope.currentPage.pageId;
					var newContent = $('#content *[compile-html]').html();
					element.find('#'+richTextID).remove();
					scope.bbcore.site.pages[pageId].content = newContent;
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
    var pos = element.position();
    var startX = 0, startY = 0;
    var x = pos.left, y = pos.top;
    // element.css({
    //   position: 'relative',
    //   border: '2px dashed #e1e1e1',
    //   cursor: 'move'
    // });
    
    element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      scope.$apply();
      scope.bbcore.snapShot();
      event.preventDefault();
      startX = event.screenX - x;
      startY = event.screenY - y;
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    element.on('mouseup', function(event) {
      var pageId = scope.currentPage.pageId;
			var newContent = $('#content *[compile-html]').html();
			scope.bbcore.site.pages[pageId].content = newContent;
			scope.$apply();
			scope.bbcore.updateHistorial();
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
      // scope.$watch(scope.bbcore.site.pages[0], function(html) {
      //   alert('modified');
      // });

			// Undo Changes
			element.on('click', '*[data-undo]', function() {
        console.log('::scope.bbcore.site.pages:before:'+scope.bbcore.site.pages);
        console.log('::scope.bbcore.site.pages.lenght:before:'+scope.bbcore.site.pages.length);
        console.log('::scope.versions:before:'+scope.versions);
        console.log('::scope.versions:lenght:before:'+scope.versions.length);
				if (scope.bbcore.edit === true && scope.versions.length>0) {
					var pageId = scope.currentPage.pageId;

					if (scope.versionIndex > 0) {
						scope.bbcore.site.pages = scope.versions[scope.versionIndex-1];
						scope.versionIndex = scope.versionIndex-1;
					}
					else {
						// Disable Button
					}
          console.log('::scope.bbcore.site.pages:after:'+scope.bbcore.site.pages);
          console.log('::scope.bbcore.site.pages.lenght:after:'+scope.bbcore.site.pages.length);
          console.log('::scope.versions:after:'+scope.versions);
          console.log('::scope.versions:lenght:after:'+scope.versions.length);
					scope.currentPage = scope.bbcore.site.pages.filter(function(e){if(e.pageId === pageId){return e;}})[0];
					scope.$apply();
				}
				else {
					// Disable Button
				}
			});

			// Repeat Changes data-repeat
			element.on('click', '*[data-repeat]', function() {
				if (scope.bbcore.edit === true && scope.versions) {
          console.log('Repeating...');
          console.log('scope.currentPage:Before:'+JSON.stringify(scope.currentPage));
					var pageId = scope.currentPage.pageId;
					if (scope.versionIndex+1 < scope.versions.length) {
					  scope.bbcore.site.pages = scope.versions[scope.versionIndex+1];
						// scope.$apply();
						scope.versionIndex = scope.versionIndex+1;
					}
					else {
						// Disable Button
					}
          scope.currentPage = scope.bbcore.site.pages.filter(function(e){if(e.pageId === pageId){return e;}})[0];
          console.log('scope.currentPage:After:'+JSON.stringify(scope.currentPage));
					scope.$apply();
				}
				else {
					// Disable Button
				}
			});

			// Save Page
			element.on('click', '*[data-save]', function() {
				// localStorage.bbSite01 = JSON.stringify(scope.bbcore.site);
				// scope.$apply();
				// // $route.reload(); ?$location?
				// $('#pageSettingsModal').modal('hide');
        // removeEditionAttributes();
        (function() {
          $('*')
            .removeAttr('draggable');
          var pageId = scope.currentPage.pageId;
          var newContent = $('#content *[compile-html]').html();
          scope.bbcore.site.pages[pageId].content = newContent;
          // scope.$apply();
        })();
				scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
				scope.bbcore.siteQuery[0].save();
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

      var removeEditionAttributes = function() {
        element.find('*')
          .removeAttr('draggable');
        var pageId = scope.currentPage.pageId;
        var newContent = $('#content *[compile-html]').html();
        scope.bbcore.site.pages[pageId].content = newContent;
        scope.$apply();
      };

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

      var removeEditionAttributes = function() {
        element.find('*')
          .removeAttr('draggable');
        var pageId = scope.currentPage.pageId;
        var newContent = $('#content *[compile-html]').html();
        scope.bbcore.site.pages[pageId].content = newContent;
        // scope.$apply();
      };


      // Event Handler
      $rootScope.$on('$routeChangeSuccess', function() {
				updatePageList();
        // removeEditionAttributes();
        // scope.$apply();
	    });


			// Dialog for Add New Page
			element.on('click', 'li[data-page-add]', function() {
				var modalID = '#AddPageModal';
				$(modalID).modal('show');

				$(modalID).on('click', '*[data-apply]', function() {
					var title = scope.NewPage.title;
					var url = title.split(' ').join('-').toLowerCase();
					var newPage = scope.bbcore.addPage(title, url, '<div id="bb-rich-text1" bb-element="bb-rich-text"><p>Double click here in order to edit this paragraph</p></div>');
					$location.path((newPage.url));
					scope.$apply();
					$(modalID).modal('hide');
				});
			});

			// Show Page Editor for selected page
			element.on('click', 'li *[data-page-id]', function() {
				var modalID = '#pageSettingsModal';
				var pageId = $(this).data('page-id');
				scope.beforeSite = JSON.parse( JSON.stringify(scope.bbcore.site) );

				scope.PageEditing = scope.bbcore.site.pages[pageId];
				$location.path(scope.PageEditing.url);
				scope.$apply();
				$(modalID).modal('show');

				// Remove Page
				$(modalID).on('click', '*[data-remove]', function() {
					var pageId = scope.PageEditing.pageId;
					scope.bbcore.site.pages.splice(pageId, 1);
					scope.PageEditing = {};
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Close Modal
				$(modalID).on('click', '*[data-dismiss]', function() {
					scope.bbcore.site = scope.beforeSite = JSON.parse( JSON.stringify(scope.beforeSite) );
					scope.$apply();
					$(modalID).modal('hide');
				});

				// Apply Changes
				$(modalID).on('click', '*[data-apply]', function() {
          // alert(JSON.stringify(scope.PageEditing));
					var priorUrl = (scope.beforeSite.pages[scope.PageEditing.pageId]).url;
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
				var richTextCount = $('*[bb-element="bb-rich-text"]').length;
        var uuid = generateUid();
				// console.log(richTextCount.length);
				var left = 460+(richTextCount*32);
				var top = 120+(richTextCount*32);
				richTextCount+=1;
				$('#content *[compile-html]').append($('<div id="bb'+uuid+'"'+' bb-element="bb-rich-text" style="left:'+left+'px; '+'top:'+top+'px; position:absolute"><p jqyoui-draggable="{data-drag: \'true\'}">I\'m a paragraph, double click here in order to add<br/>your own text.</p></div>') );
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