'use strict';

angular.module('adminApp')
  /**
   * Post Manager
   */
  .directive('bbPostsManager', function() {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // Select/Un-select All
        element.on('click', '.select-all', function(event) {
          if ($(this).prop('checked')) {
            element.find('.post-list input[type="checkbox"]')
              .prop('checked', true);
          }
          else {
            element.find('.post-list input[type="checkbox"]')
              .prop('checked', false);
          }
        });

        // Apply Bulk Operation
        element.on('click', 'button.bulk-operation', function(event) {
          var action = element.find('#bulk').eq(0).val();
          // alert(action);
          if (action!=='') {
            element.find('.post-list input[type="checkbox"]:checked').each(function(index) {
              var postId = $(this).data('post-id');
              if (action === 'delete') {
                scope.bbcore.site.posts = scope.bbcore.site.posts.filter( function(e) {
                  if (e.postId !== postId) {
                    return e;
                  }
                });
              }
            });
            scope.$apply();
            scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
            scope.bbcore.siteQuery[0].save().then(function(response) {
              $location.path('/posts');
              scope.$apply();
            }, function(error) {
              alert(error.message);
            });
          }
          else {
            alert('Select an Action');
          }
        });
      },
      templateUrl: 'scripts/directives/posts_manager.html',
      replace: true,
      transclude: false
    };
  })
  


  /**
   * Post Editor
   */
  .directive('bbPostEditor', function($location) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // Setups Wysiwyg Editor
        var editorID = 'editor1';
        var loadEditor = function() {
          CKEDITOR.replace( 'editor1', {
            allowedContent: true
          });
        };
        loadEditor();

        // Sets currentPost content into the Wysiwyg editor
        var editor = CKEDITOR.instances[editorID];
        scope.$on('loadedContent', function(content) {
          if (!scope.bbcore.currentPost) {
            scope.bbcore.currentPost = {
              postId: 8,
              content: ''
            };
            scope.$apply();
            scope.bbcore.site.posts.push(scope.bbcore.currentPost);
          }
          else {
            // Do Something
          }
          scope.$apply();
          editor.setData(scope.bbcore.currentPost.content);
        });

        // Function which saves the current post
        element.on('click', 'button[data-action="save-post"]', function(event) {
          (function() {
            var date = new Date();
            var postId = scope.bbcore.currentPost.postId;
            var postIndex;

            scope.bbcore.site.posts.filter(function(e, i) {
              if (e.postId === postId) {
                postIndex = i;
                return e;
              };
            });
            
            // Fields
            var newContent = editor.getData();

            scope.bbcore.currentPost.content = newContent;
            scope.bbcore.currentPost.url = scope.bbcore.currentPost.title.toLowerCase().split(' ').join('-');
            scope.bbcore.site.posts[postIndex].content = newContent;
            scope.bbcore.site.posts[postIndex].updatedAt = date.toGMTString();
            scope.$apply();
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation
          // scope.bbcore.site.posts = [
          //   {
          //     postId: 0,
          //     title: 'Useful Tips',
          //     content: '<p>We have selected this very useful teps for you!</p>'
          //   },
          //   {
          //     postId: 1,
          //     title: 'How to be a succesful Chef',
          //     content: '<p>We have selected this very useful for chefs!</p>'
          //   }
          // ];
          // scope.$apply();
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save().then(function(response) {
            $location.path('/posts');
            scope.$apply();
          }, function(error) {
            alert(error.message);
          });
          // scope.bbcore.saveSite();
        });

        // Function which cancel the current post edition
        element.on('click', 'button[data-action="dismiss"]', function(event) {
          $location.path('/posts');
          scope.$apply();
        });
      },
      templateUrl: 'scripts/directives/post_editor.html',
      replace: true,
      transclude: false
    };
  })
  


  /**
   * Page Manager
   */
  .directive('bbPagesManager', function() {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // Select/Un-select All
        element.on('click', '.select-all', function(event) {
          if ($(this).prop('checked')) {
            element.find('.page-list input[type="checkbox"]')
              .prop('checked', true);
          }
          else {
            element.find('.page-list input[type="checkbox"]')
              .prop('checked', false);
          }
        });

        // Apply Bulk Operation
        element.on('click', 'button.bulk-operation', function(event) {
          var action = element.find('#bulk').eq(0).val();
          // alert(action);
          if (action!=='') {
            element.find('.page-list input[type="checkbox"]:checked').each(function(index) {
              var pageId = $(this).data('page-id');
              if (action === 'delete') {
                scope.bbcore.site.pages = scope.bbcore.site.pages.filter( function(e) {
                  if (e.pageId !== pageId) {
                    return e;
                  }
                });
                // alert('deleting: ' + $(this).data('page-id'));
              }
             // alert($(this).data('page-id'));
            });            
            scope.$apply();
            scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
            scope.bbcore.siteQuery[0].save().then(function(response) {
              $location.path('/pages');
              scope.$apply();
            }, function(error) {
              alert(error.message);
            });
          }
          else {
            alert('Select an Action');
          }
        });
      },
      templateUrl: 'scripts/directives/pages_manager.html',
      replace: true,
      transclude: false
    };
  })



  /**
   * CKEditor
   */
  // .directive('bbWysiwygEditor', function() {
  //   return {
  //     restrict: 'A',
  //     scope: false,
  //     link: function(scope, element) {
  //       var editorID = 'editor1';
  //       var loadEditor = function() {
  //         CKEDITOR.replace( 'editor1', {
  //           allowedContent: true
  //         });
  //       };
  //       loadEditor();

  //       // Set current content
  //       var editor = CKEDITOR.instances[editorID];        
        
  //       scope.$on('loadedContent', function(content) {
  //         editor.setData(scope.bbcore.currentPage.content);
  //       });
        
  //     },
  //     templateUrl: 'scripts/directives/ckeditor.html',
  //     replace: true,
  //     transclude: false
  //   }
  // })



  /**
   * Page Editor
   */
  .directive('bbPageEditor', function($location) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // Setups Wysiwyg Editor
        var editorID = 'editor1';
        var loadEditor = function() {
          CKEDITOR.replace( 'editor1', {
            allowedContent: true
          });
        };
        loadEditor();

        // Sets currentPage content into the Wysiwyg editor
        var editor = CKEDITOR.instances[editorID];
        scope.$on('loadedContent', function(content) {
          if (!scope.bbcore.currentPage) {
            scope.bbcore.currentPage = {
              pageId: 8,
              content: ''
            };
            scope.$apply();
            scope.bbcore.site.pages.push(scope.bbcore.currentPage);
          }
          else {
            // Do Something
          }
          scope.$apply();
          editor.setData(scope.bbcore.currentPage.content);
        });

        // Function which saves the current page
        element.on('click', 'button[data-action="save"]', function(event) {
          (function() {
            var date = new Date();
            var pageId = scope.bbcore.currentPage.pageId;
            var pageIndex;

            scope.bbcore.site.pages.filter(function(e, i) {
              if (e.pageId === pageId) {
                pageIndex = i;
                return e;
              };
            });
            // alert('indexOf:: ' + JSON.stringify(pageIndex));

            // Fields
            var newContent = editor.getData();

            scope.bbcore.currentPage.content = newContent;
            scope.bbcore.currentPage.url = scope.bbcore.currentPage.title.toLowerCase().split(' ').join('-');
            scope.bbcore.site.pages[pageIndex].content = newContent;
            scope.bbcore.site.pages[pageIndex].updatedAt = date.toGMTString();
            scope.$apply();
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation
          scope.bbcore.site.posts = [
            {
              postId: 0,
              title: 'Useful Tips',
              content: '<p>We have selected this very useful teps for you!</p>'
            },
            {
              postId: 1,
              title: 'How to be a succesful Chef',
              content: '<p>We have selected this very useful for chefs!</p>'
            }
          ];
          scope.$apply();
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save().then(function(response) {
            $location.path('/pages');
            scope.$apply();
          }, function(error) {
            alert(error.message);
          });
          // scope.bbcore.saveSite();
        });

        // Function which cancel the current page edition
        element.on('click', 'button[data-action="dismiss"]', function(event) {
          $location.path('/pages');
          scope.$apply();
        });
      },
      templateUrl: 'scripts/directives/page_editor.html',
      replace: true,
      transclude: false
    };
  });