'use strict';

function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-5);
}

angular.module('adminApp')
  /**f
   * Post Manager
   */
  .directive('bbPostsManager', function($location) {
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

          if (action!=='') {
            element.find('.post-list input[type="checkbox"]:checked').each(function(index) {
              var postId = $(this).data('post-id');
              if (action === 'delete') {
                scope.bbcore.site.posts = scope.bbcore.site.posts.filter( function(e) {
                  if (e.postId != postId) {
                    return e;
                  }
                });
              }
            });
            // scope.$apply();
            scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
            scope.bbcore.siteQuery[0].save().then(function(response) {
              $location.path('/posts');
              // scope.$apply();
            }, function(error) {
              alert(error.message);
            });
          }
          else {
            // Add code here if needed.
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
        var newEntry = false;
        
        // Checks if currentPost for editing or creates a new one
        if (!scope.bbcore.currentPost) {
          
          scope.bbcore.currentPost = {
            postId: generateUID(),
            content: ''
          };          
          newEntry = true;
        }
        else {
          // Add code here if needed
        }
                
        // Setups Wysiwyg Editor
        var editorID = 'editor1';
        var editor = {};
        var loadEditor = function() {
          if (!CKEDITOR.instances[editorID]) {
            CKEDITOR.replace('editor1', {
              allowedContent: true
            });
            editor = CKEDITOR.instances[editorID];
          }
          else {
            // Add code here if needed
          }
        };
        loadEditor();

        // Sets currentPost content into the Wysiwyg editor
        var setContent = function() {
          if (CKEDITOR.instances[editorID] && scope.bbcore.currentPost) {            
            CKEDITOR.instances[editorID].setData(scope.bbcore.currentPost.content);            
          }
        };
        setContent();

        // Function which saves the current post
        element.on('click', 'button[data-action="save-post"]', function(event) {
          (function() {
            var date = new Date();
            var postId = scope.bbcore.currentPost.postId;
            var postIndex;

            if (newEntry == true) {
              scope.bbcore.site.posts.push(scope.bbcore.currentPost);
            }

            scope.bbcore.site.posts.filter(function(e, i) {
              if (e.postId === postId) {
                postIndex = i;
                return e;
              };
            });
            
            // Fields
            var newContent = CKEDITOR.instances[editorID].getData();

            scope.bbcore.currentPost.content = newContent;
            
            // Formating URL
            scope.bbcore.currentPost.url = scope.bbcore.currentPost.title.toLowerCase().split(' ').join('-');
            
            scope.bbcore.site.posts[postIndex].content = newContent;
            scope.bbcore.site.posts[postIndex].updatedAt = date.toGMTString();            
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation         
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save().then(function(response) {
            $location.path('/posts');
            scope.$apply();
          }, function(error) {
            alert(error.message);
          });
        });

        // BS3 Accordion
        element.on('click', '.panel-heading', function(event) {
          $(this).parent()
            .find('.collapse')
              .toggleClass('in');
        });

        // Function which cancel the current post edition
        element.on('click', 'button[data-action="dismiss"]', function(event) {
          $location.path('/posts');
        });
      
        scope.$on('$routeChangeStart', function(next, current) {
          if (CKEDITOR.instances[editorID]) {
            CKEDITOR.instances[editorID].destroy();
            // delete scope.bbcore.currentPost;
          }
       });
      },
      templateUrl: 'scripts/directives/post_editor.html',
      replace: true,
      transclude: false
    };
  })


  
  /**
   * Page Editor
   */
  .directive('bbPageEditor', function($location) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        var newEntry = false;
        
        // Checks if currentPage for editing or creates a new one
        if (!scope.bbcore.currentPage) {
          
          scope.bbcore.currentPage = {
            pageId: generateUID(),
            content: ''
          };          
          newEntry = true;
        }
        else {
          // Add code here if needed
        }
                
        // Setups Wysiwyg Editor
        var editorID = 'editor1';
        var editor = {};
        var loadEditor = function() {
          if (!CKEDITOR.instances[editorID]) {
            CKEDITOR.replace('editor1', {
              allowedContent: true
            });
            editor = CKEDITOR.instances[editorID];
          }
          else {
            // Add code here if needed
          }
        };
        loadEditor();

        // Sets currentPage content into the Wysiwyg editor
        var setContent = function() {
          if (CKEDITOR.instances[editorID] && scope.bbcore.currentPage) {
            CKEDITOR.instances[editorID].setData(scope.bbcore.currentPage.content);
          }
        };
        setContent();

        // Function which saves the current page
        element.on('click', 'button[data-action="save-page"]', function(event) {
          (function() {
            var date = new Date();
            var pageId = scope.bbcore.currentPage.pageId;
            var pageIndex;

            if (newEntry == true) {
              scope.bbcore.site.pages.push(scope.bbcore.currentPage);
            }

            scope.bbcore.site.pages.filter(function(e, i) {
              if (e.pageId === pageId) {
                pageIndex = i;
                return e;
              };
            });
            
            // Fields
            var newContent = CKEDITOR.instances[editorID].getData();

            scope.bbcore.currentPage.content = newContent;
            
            // Formating URL
            scope.bbcore.currentPage.url = scope.bbcore.currentPage.title.toLowerCase().split(' ').join('-');
            
            scope.bbcore.site.pages[pageIndex].content = newContent;
            scope.bbcore.site.pages[pageIndex].updatedAt = date.toGMTString();
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation         
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save().then(function(response) {
            $location.path('/pages');
            scope.$apply();
          }, function(error) {
            alert(error.message);
          });
        });

        // BS3 Accordion
        element.on('click', '.panel-heading', function(event) {
          $(this).parent()
            .find('.collapse')
              .toggleClass('in');
        });

        // Function which cancel the current page edition
        element.on('click', 'button[data-action="dismiss"]', function(event) {
          $location.path('/pages');
        });
      
        scope.$on('$routeChangeStart', function(next, current) {
          if (CKEDITOR.instances[editorID]) {
            CKEDITOR.instances[editorID].destroy();
            // delete scope.bbcore.currentPage;
          }
       });
      },
      templateUrl: 'scripts/directives/page_editor.html',
      replace: true,
      transclude: false
    };
  })


  


  /**
   * Page Manager
   */
  .directive('bbPagesManager', function($location) {
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
          
          if (action!=='') {
            element.find('.page-list input[type="checkbox"]:checked').each(function(index) {
              var pageId = $(this).data('page-id');
              
              if (action === 'delete') {
                scope.bbcore.site.pages = scope.bbcore.site.pages.filter( function(e) {
                  if (e.pageId != pageId) {
                    return e;
                  }
                });
              }
            });
            // scope.$apply();
            scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
            scope.bbcore.siteQuery[0].save().then(function(response) {
              $location.path('/pages');
              // scope.$apply();
            }, function(error) {
              alert(error.message);
            });
          }
          else {
            // Add code here if required
          }
        });
      },
      templateUrl: 'scripts/directives/pages_manager.html',
      replace: true,
      transclude: false
    };
  })



  /**
   * Page Editor
   */
  .directive('bbPageEditorx', function($location) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // Updates CKEditor content when changes in the $scope
        scope.$watch('bbcore.currentPage.content', function(newValue, oldValue){
          if (newValue) {
            loadEditor();
            setContent();
          }
          else {
            loadEditor();
          }
        });

        // BS3 Accordion
        element.on('click', '.panel-heading', function(event) {
          $(this).parent()
            .find('.collapse')
              .toggleClass('in');
        });

        // Setups Wysiwyg Editor
        var editorID = 'editor1';
        // var editor;
        var loadEditor = function() {
          CKEDITOR.replace( 'editor1', {
            allowedContent: true
          });
          editor = CKEDITOR.instances[editorID];
          // editor.setData(scope.bbcore.currentPage.content);
        };


        // Sets currentPage content into the Wysiwyg editor
        // scope.$on('loadedContent', function(content) {
        var setContent = function() {
          if (!scope.bbcore.currentPage) {
            scope.bbcore.currentPage = {
              pageId: generateUID(),
              content: ''
            };
            // scope.$apply();
            scope.bbcore.site.pages.push(scope.bbcore.currentPage);
          }
          else {
            // Do Something
          }
        };
        
        // scope.$apply();
        // loadEditor();
        // });

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

            // Fields
            var newContent = CKEDITOR.instances[editorID].getData();

            scope.bbcore.currentPage.content = newContent;

            // Formating URL
            if (!scope.bbcore.currentPage.url) {
              scope.bbcore.currentPage.url = scope.bbcore.currentPage.title.toLowerCase().split(' ').join('-');
            }

            // scope.$apply();
            scope.bbcore.site.pages[pageIndex].content = newContent;
            scope.bbcore.site.pages[pageIndex].updatedAt = date.toGMTString();
            // scope.$apply();
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation
          
          // scope.$apply();
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
          // scope.$apply();
        });
      },
      templateUrl: 'scripts/directives/page_editor.html',
      replace: true,
      transclude: false
    };
  })
  
  
  
  /**
   * Page Editor
   */
  .directive('bbPageSettings', function($location) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element) {
        // BS3 Accordion
        // element.on('click', '.panel-heading', function(event) {
        //   $(this).parent()
        //     .find('.collapse')
        //       .toggleClass('in');
        // });      

        // Function which saves the current page
        element.on('click', 'button[data-action="save-settings"]', function(event) {
          (function() {
            // var date = new Date();
            // var pageId = scope.bbcore.currentPage.pageId;
            // var pageIndex;

            // scope.bbcore.site.pages.filter(function(e, i) {
            //   if (e.pageId === pageId) {
            //     pageIndex = i;
            //     return e;
            //   };
            // });

            // Fields
            // var newContent = CKEDITOR.instances[editorID].getData();

            // scope.bbcore.currentPage.content = newContent;

            // if (!scope.bbcore.currentPage.url) {
            //   scope.bbcore.currentPage.url = scope.bbcore.currentPage.title.toLowerCase().split(' ').join('-');
            // }

            // scope.bbcore.site.pages[pageIndex].content = newContent;
            // scope.bbcore.site.pages[pageIndex].updatedAt = date.toGMTString();
            // scope.$apply();
          })();
          // Todo: Move this snippet to the main.js as a save function in order to use form validation
          
          // scope.$apply();
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save().then(function(response) {
            $location.path('/');
            scope.$apply();
          }, function(error) {
            alert(error.message);
          });
          // scope.bbcore.saveSite();
        });

        // Function which cancel the current page edition
        element.on('click', 'button[data-action="dismiss"]', function(event) {
          $location.path('/pages');
          // scope.$apply();
        });
      },
      templateUrl: 'scripts/directives/page_settings.html',
      replace: true,
      transclude: false
    };
  });