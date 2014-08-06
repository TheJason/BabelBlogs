'use strict';
angular.module('blogTemplateApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.sortable'
]).config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({ redirectTo: '/' });  // use the HTML5 History API
                                                    // $locationProvider.html5Mode(true);
  }
]);
'use strict';
angular.module('blogTemplateApp').controller('BBCoreCtrl', [
  '$sce',
  '$rootScope',
  '$scope',
  '$route',
  '$location',
  'user',
  function ($sce, $rootScope, $scope, $route, $location, user) {
    $scope.bbcore = {};
    $scope.bbcore.user = user;
    $scope.bbcore.edit = true;
    $scope.bbcore.selectedElement = '';
    // $scope.bbcore.site = Site;
    $scope.versions = [];
    // $scope.contents = {};
    // console.log(JSON.stringify($scope.bbcore.site));
    // jQueryUI Sortable options
    $scope.bbcore.sortablePageMenuOptions = {
      start: function (e, ui) {
        $scope.bbcore.snapShot();
      },
      update: function (e, ui) {
        $scope.bbcore.updateHistorial();
      },
      axis: 'y'
    };
    // Static Login, for Dev purpose(remove it)
    $scope.bbcore.user.logIn('dev', 'default');
    // console.log('isAuthenticated: '+$scope.bbcore.user.isAuthenticated());
    var getSite = function () {
      var query = new Parse.Query('Site');
      query.equalTo('objectId', 'Y4KkHHrfrQ');
      query.find().then(function (site) {
        var Site = JSON.parse(site[0].get('schema'));
        console.log('Schema' + JSON.parse(site[0].get('schema')));
        $scope.bbcore.site = JSON.parse(site[0].get('schema'));
        $scope.bbcore.siteQuery = site;
        $scope.$apply();
        return $scope.bbcore.site;
      }).then(function (Site) {
        $scope.bbcore.site = Site;
        // Load Pages from Service and bind their Routes.        
        $route.routes[''] = {
          keys: [],
          originalPath: '',
          redirectTo: '/',
          regexp: /^$/
        };
        var i;
        for (i = 0; i < Site.pages.length; i++) {
          var page = Site.pages[i];
          var path = page.url;
          var RePath = new RegExp('^\\/' + path + '$');
          var originalPath = '/' + path;
          var keyPath = '';
          if (path === '/') {
            keyPath = path;
            RePath = new RegExp('^\\' + path + '$');
            originalPath = path;
          } else {
            keyPath = '/' + path;
          }
          $route.routes[keyPath] = {
            keys: [],
            originalPath: originalPath,
            regexp: RePath,
            reloadOnSearch: true,
            templateUrl: 'views/_page.html'
          };
          if (path !== '/') {
            RePath = new RegExp('^\\/' + path + '\\/' + '$');
            $route.routes[keyPath + '/'] = {
              keys: [],
              originalPath: originalPath + '/',
              regexp: RePath,
              reloadOnSearch: true,
              redirectTo: keyPath
            };
          }
        }
        $route.reload();
        /**
         * Events Listeners
         */
        // When Route Change Success
        $rootScope.$on('$routeChangeSuccess', function () {
          $scope.currentPath = $location.path();
          $scope.currentPage = Site.pages.filter(function (e) {
            if (e.url === $scope.currentPath || e.url === $scope.currentPath.replace('/', '')) {
              return e.content;
            }
          })[0];
          $scope.versions = [];
        });
      });
    };
    getSite();
    // // Load Pages from Service and bind their Routes.        
    // $route.routes[''] = {
    //   keys: [],
    //   originalPath: '',
    //   redirectTo: '/',
    //   regexp: /^$/,
    // };
    // var i;
    // for (i=0; i<Site.pages.length; i++) {
    //   var page = Site.pages[i];
    //   var path = page.url;
    //   var RePath = new RegExp('^\\/'+path+'$');
    //   var originalPath = '/'+path;
    //   var keyPath = '';
    //   if (path === '/') {
    //     keyPath = path;
    //     RePath = new RegExp('^\\'+path+'$');
    //     originalPath = path;
    //   }
    //   else {
    //     keyPath = '/'+path;
    //   }
    //   $route.routes[keyPath] = {
    //     keys: [],
    //     originalPath: originalPath,
    //     regexp: RePath,
    //     reloadOnSearch: true,
    //     templateUrl: 'views/_page.html'
    //   };
    //   if (path !== '/') {
    //     RePath = new RegExp('^\\/'+path+'\\/'+'$');
    //     $route.routes[keyPath+'/'] = {
    //       keys: [],
    //       originalPath: originalPath+'/',
    //       regexp: RePath,
    //       reloadOnSearch: true,
    //       redirectTo: keyPath
    //     };
    //   }
    // }
    // /**
    //  * Events Listeners
    //  */
    // // When Route Change Success
    // $rootScope.$on('$routeChangeSuccess', function() {
    //   $scope.currentPath = $location.path();
    //   $scope.currentPage = Site.pages.filter(function(e) {
    //     if (e.url === $scope.currentPath || e.url === $scope.currentPath.replace('/', '')) {
    //       return e.content;
    //     }
    //   })[0];
    //   $scope.versions = [];
    // });
    /**
     * Function which verify if user is Authenticathed
     * If user is not authenticated then redirects to login view
     */
    // (function() {
    //   if ( !user.current() ) {
    //     $scope.bbcore.user.isLogin = false;
    //     $location.path('/auth');
    //   }
    // })();
    /**
     * Function that Creates a new user and redirect to main view
     */
    // $scope.SignUp = function() {
    //   console.log('::SignUp:');
    //   // Create a New User Object
    //   var user = new Parse.User();
    //   /**
    //    * Validate Inputs
    //    */
    //    if (!$scope.newUser.name) {
    //     $scope.showAlert('Missing user name', 'Please provide a valid user name.');
    //     return;
    //    }
    //    else if (!$scope.newUser.email) {
    //     $scope.showAlert('Missing E-mail', 'Please provide a valid e-mail.');
    //     return;
    //    }
    //    else if (!$scope.newUser.password) {
    //     $scope.showAlert('Missing password', 'Please provide a password.');
    //     return;
    //    }
    //   // Populated user with provided form data
    //   user.set('username', $scope.newUser.name);
    //   user.set('email', $scope.newUser.email);
    //   user.set('password', $scope.newUser.password);
    //   user.set('birthday', $scope.newUser.birthday);
    //   user.set('gender', $scope.newUser.gender);
    //   // Save new user data
    //   user.signUp(null).then(function(user) {
    //     $scope.newUser = {};
    //     $location.path('/');
    //     $scope.$apply();
    //   }, function(error) {
    //     $scope.showAlert('Error', error.message);
    //   });
    // };
    // Snapshot Current Site Changes
    $scope.bbcore.snapShot = function () {
      // $scope.versions.push($scope.beforeSite.pages);
      $scope.beforeSite = JSON.parse(JSON.stringify($scope.bbcore.site));
      console.log('snapShot' + $scope.beforeSite);
    };
    // Update Changes Historial
    $scope.bbcore.updateHistorial = function () {
      if ($scope.versionIndex && $scope.versions) {
        $scope.versions = $scope.versions.slice(0, $scope.versionIndex);  // $scope.$apply();
                                                                          // $scope.versionIndex = $scope.versions.length;
                                                                          // $scope.$apply();        
                                                                          // alert('indexVersion: '+$scope.versionIndex);
                                                                          // alert('versionsLenght: '+$scope.versions.length);
                                                                          // $scope.$apply();
      }
      // alert(JSON.stringify($scope.beforeSite.pages));
      if ($scope.beforeSite.pages) {
        $scope.$apply();
        $scope.versions.push($scope.beforeSite.pages);
        // $scope.versions.push($scope.bbcore.site.pages);
        $scope.beforeSite = [];
        $scope.versionIndex = $scope.versions.length;
        console.log('::versions:length: ' + $scope.versions.length);
        console.log('::versionIndex:: ' + $scope.versionIndex);
      }
    };
    // Function which add a new page
    $scope.bbcore.addPage = function (name, path, content) {
      // Add the page to the service.
      var newPageId = $scope.bbcore.site.pages.length + 1;
      var newPage = {
          id: newPageId,
          title: name,
          description: name,
          type: 'page',
          content: content,
          url: path
        };
      $scope.bbcore.site.pages.push(newPage);
      // Add the Route
      var RePath = new RegExp('^\\/' + path + '$');
      var originalPath = '/' + path;
      var keyPath = '';
      if (path === '/') {
        keyPath = path;
        RePath = new RegExp('^\\' + path + '$');
        originalPath = path;
      } else {
        keyPath = '/' + path;
      }
      $route.routes[keyPath] = {
        keys: [],
        originalPath: originalPath,
        regexp: RePath,
        reloadOnSearch: true,
        templateUrl: 'views/_page.html'
      };
      if (path !== '/') {
        RePath = new RegExp('^\\/' + path + '\\/' + '$');
        $route.routes[keyPath + '/'] = {
          keys: [],
          originalPath: originalPath + '/',
          regexp: RePath,
          reloadOnSearch: true,
          redirectTo: keyPath
        };
      }
      return newPage;
    };
    // Toggle HTML Editor
    $scope.toggleEdition = function () {
      if ($scope.bbcore.edit === true) {
        $scope.bbcore.edit = false;
      } else {
        $scope.bbcore.edit = true;
      }
    };
    // Turn strings with HTML tags in Trusted HTML
    $scope.trustedHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }
]).controller('MainCtrl', [
  '$scope',
  '$route',
  function ($scope, $route) {
  }
]);
'use strict';
/*jshint multistr: true */
angular.module('blogTemplateApp').factory('Site', function () {
  if (localStorage.bbSite01) {
    var siteSchema = JSON.parse(localStorage.bbSite01);
  } else {
    // var siteSchema = {
    // 	siteName: 'babel-demo',
    // 	metaData:	{
    // 		siteTitle : 'Babel Blogs, Multi-lingual Web Systems',
    // 		keywords: '',
    // 		description: '',
    // 	},
    // 	design:	{
    // 		theme: 'demo',
    // 		customCSS: '/path/',
    // 		favicon: '/path/',
    // 		logo: '/path/',
    // 		appIcons: {
    // 			ios:
    // 				{0: '/* IOS ICONS */'},
    // 			android:
    // 				{0: '/* ANDROID ICONS */'},
    // 			windows:
    // 				{0: '/* WINDOWS ICONS */'},
    // 			blackberry:
    // 				{0: '/* BLACKBERRY ICONS */'},
    // 			kindle:
    // 				{0: '/* KINDLE ICONS */'},
    // 			Tizen:
    // 				{0: '/* TIZEN ICONS */'}
    // 		}
    // 	},
    // 	pages: [
    // 		{
    // 			pageID: '',
    // 			parentId: '',
    // 			sectionID: '',
    // 			title: '',
    // 			metaData: {
    // 				googlePlus: {
    // 					name: '',
    // 					description: '',
    // 					image: ''
    // 				},
    // 				twitter: {
    // 					card:'summary_large_image',
    // 					site:'http://mysite.com',
    // 					title:'Page Title',
    // 					description:'Description of the page',
    // 					creator:'Babel Blogs, LLC'
    // 				},
    // 				openGraph: {
    // 					title: '',
    // 					type: '',
    // 					url: '',
    // 					image: '',
    // 					description: '',
    // 					site_name:'Babel Blogs Demo'
    // 				},
    // 				seo: {
    // 					title: '',
    // 					description: '',
    // 					keywords: ''
    // 				}
    // 			},
    // 			body:''
    // 		}
    // 	]
    // };
    var siteSchema = {
        siteName: 'Dental Solutions',
        metaData: {
          siteTitle: 'Babel Blogs, Multi-lingual Web Systems',
          keywords: '',
          description: ''
        },
        design: {
          theme: 'demo',
          customCSS: '/path/',
          favicon: '/path/',
          logo: '/path/',
          appIcons: {
            ios: { 0: '/* IOS ICONS */' },
            android: { 0: '/* ANDROID ICONS */' },
            windows: { 0: '/* WINDOWS ICONS */' },
            blackberry: { 0: '/* BLACKBERRY ICONS */' },
            kindle: { 0: '/* KINDLE ICONS */' },
            tizen: { 0: '/* TIZEN ICONS */' }
          }
        },
        pages: [
          {
            description: 'Home Page.',
            pageId: '0',
            parentId: '',
            sectionID: '',
            title: 'Home',
            url: '/',
            metaData: {
              googlePlus: {
                name: '',
                description: '',
                image: ''
              },
              twitter: {
                card: 'summary_large_image',
                site: 'http://mysite.com',
                title: 'Page Title',
                description: 'Description of the page',
                creator: 'Babel Blogs, LLC'
              },
              openGraph: {
                title: '',
                type: '',
                url: '',
                image: '',
                description: '',
                site_name: 'Babel Blogs Demo'
              },
              seo: {
                title: '',
                description: ''
              }
            },
            content: '<div id="bb-rich-text1" bb-element="bb-image"><img src="/images/custom/dentist.jpg" alt=""></div>\t\t\t\t\t\t<div id="bb-rich-text2" bb-element="bb-rich-text"><h2>We are experts in dental solutions.</h2></div>'
          },
          {
            description: 'About Us.',
            pageId: '1',
            parentID: '',
            sectionID: '',
            title: 'About US',
            url: 'about',
            metaData: {
              googlePlus: {
                name: '',
                description: '',
                image: ''
              },
              twitter: {
                card: 'summary_large_image',
                site: 'http://mysite.com',
                title: 'Page Title',
                description: 'Description of the page',
                creator: 'Babel Blogs, LLC'
              },
              openGraph: {
                title: '',
                type: '',
                url: '',
                image: '',
                description: '',
                site_name: 'Babel Blogs Demo'
              },
              seo: {
                title: '',
                description: ''
              }
            },
            content: '<div id="bb-rich-text1" bb-element="bb-rich-text" style="width: 460px;"><p>I\'m a paragraph. Click here to add your own text and edit me. It\u2019s easy. Just click \u201cEdit Text\u201d or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I\u2019m a great place for you to tell a story and let your users know a little more about you.\t\t\t\t\t\t\u200b\t\t\t\t\t\t<br/><br/>This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business.</p></div>\t\t\t\t\t\t<div bb-element="bb-image"><img src="/images/custom/dentist02.jpg" alt="" width="320"></div>'
          }
        ]
      };  // 		var siteSchema = {
          // 			name: 'Dental Solutions',
          // 			slogan: 'Keep it Simple!',
          // 			pages: [
          // 				{
          // 					id: 0,
          // 					title: 'Homex',
          // 					description: 'Home Page.',
          // 					type: 'page',
          // 					content: '<div class="row">\
          // 						<div class="col-md-6">\
          // 							<div id="bb-rich-text1" bb-element bb-rich-text><img src="/images/custom/dentist.jpg" alt=""></div>\
          // 						</div>\
          // 						<div class="col-md-6">\
          // 							<div id="bb-rich-text2" bb-element bb-rich-text><h2>We are experts in dental solutions.</h2></div>\
          // 						</div>\
          // 						</div>',
          // 					url: '/'
          // 				},
          // 				{
          // 					id: 1,
          // 					title: 'About Us',
          // 					description: 'About Us.',
          // 					type: 'page',
          // 					content: '<div class="row center"><div class="col-md-5"><div id="bb-rich-text1" draggable bb-element bb-rich-text><p>I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.\
          // ​\
          // <br/><br/>This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business.</p></div></div>\
          // <div class="col-md-6" bb-element bb-rich-text>\
          // 							<img src="/images/custom/dentist02.jpg" alt="" width="320">\
          // 						</div>\
          // </div>',
          // 					url: 'about'
          // 				},
          // 				{
          // 					id: 2,
          // 					title: 'Products',
          // 					description: 'List of Products we provide.',
          // 					type: 'gallery',
          // 					content: '<div class="row"><div class="col-md-12"><div id="bb-rich-text1" bb-element bb-rich-text><p> Check Our Products</p></div></div></div>',
          // 					url: 'products'
          // 				},
          // 				{
          // 					id: 3,
          // 					title: 'Services',
          // 					description: 'List of Services we provide.',
          // 					type: 'form',
          // 					content: '<h1>Our Services</h1>',
          // 					url: 'services'
          // 				},
          // 				{
          // 					id: 4,
          // 					title: 'Blog',
          // 					description: 'News Content',
          // 					type: 'form',
          // 					content: '<h1>Our Blog</h1>',
          // 					url: 'blog'
          // 				},
          // 				{
          // 					id: 5,
          // 					title: 'Contact Us',
          // 					description: 'Contact Page.',
          // 					type: 'form',
          // 					content: '<form action="contact_submit" method="get" accept-charset="utf-8" role="form">\
          //           <div class="form-group">\
          //             <label for="name">Name</label>\
          //             <input type="text" class="form-control" name="name" value="" placeholder="Name">\
          //           </div>\
          // \
          //           <div class="form-group">\
          //             <label for="email">E-mail Address</label>\
          //             <input type="email" class="form-control" name="email" value="" placeholder="E-mail">\
          //           </div>\
          // \
          //           <div class="form-group">\
          //             <label for="department">Department</label>\
          //             <select class="form-control" name="department">\
          //               <option value="sales">Sales</option>\
          //               <option value="support">Support</option>\
          //               <option value="general_inquiry">General Inquiry</option>\
          //               <option value="billing">Billing</option>\
          //               <option value="domain_routing">Domain Routing</option>\
          //               <option value="legal">Legal</option>\
          //             </select>\
          //           </div>\
          // \
          //           <div class="form-group">\
          //             <label for="department">Message</label>\
          //             <textarea class="form-control" name="message"></textarea>\
          //           </div>\
          // \
          //           <button type="submit" class="btn btn-default">Submit</button>\
          //         </form>',
          // 					url: 'contact'
          // 				}
          // 			]
          // 		};
  }
  // console.log(JSON.stringify(siteSchema));
  return siteSchema;
}).factory('user', [
  '$location',
  '$rootScope',
  function ($location, $rootScope) {
    return {
      logIn: function (username, password) {
        $rootScope.$broadcast('event:sessionUpdated');
        return Parse.User.logIn(username, password);
      },
      logOut: function () {
        Parse.User.logOut();
        $rootScope.$broadcast('event:sessionUpdated');
        this.isLogin = false;
      },
      current: function () {
        return Parse.User.current();
      },
      isAuthenticated: function () {
        if (Parse.User.current()) {
          this.isLogin = true;
          return true;
        } else {
          this.isLogin = false;
          return false;
        }
      },
      isLogin: false
    };
  }
]);
'use strict';
var generateUid = function (separator) {
  /// <summary>
  ///    Creates a unique id for identification purposes.
  /// </summary>
  /// <param name="separator" type="String" optional="true">
  /// The optional separator for grouping the generated segmants: default "-".    
  /// </param>
  var delim = separator || '-';
  function S4() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
  }
  return S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4();
};
angular.module('blogTemplateApp').directive('compileHtml', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.compileHtml, function (html) {
          ele.html(html);
          $compile(ele.contents())(scope);
        });
      }
    };
  }
]).directive('bbContent', [
  '$compile',
  '$document',
  '$rootScope',
  '$location',
  '$route',
  'Site',
  function ($compile, $document, $rootScope, $location, $route, Site) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
        var contentEl = $(this);
        var modalID = '#WYSIWYGModal';
        var editorID = 'editor1';
        var loadEditor = function () {
          CKEDITOR.replace('editor1', { allowedContent: true });
        };
        var removeEditionAttributes = function () {
          element.find('*').removeAttr('draggable');
          var pageId = scope.currentPage.pageId;
          var newContent = $('#content *[compile-html]').html();
          scope.bbcore.site.pages[pageId].content = newContent;  // scope.$apply();
        };
        // Event Handler
        $rootScope.$on('$routeChangeStart', function () {
          removeEditionAttributes();
        });
        // Clicks
        element.on('click', '*', function () {
          var unFocusComponents = function () {
            element.find('*[draggable]').removeAttr('draggable');
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
            $(this).attr('draggable', '');
          } else {
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
        element.on('dblclick', '*[bb-element="bb-rich-text"]', function () {
          // scope.$apply();
          var richTextID = $(this).attr('id');
          // console.log('richTextID: '+richTextID);
          // scope.beforeSite = JSON.parse( JSON.stringify(scope.bbcore.site) );
          scope.bbcore.snapShot();
          scope.richTextEditing = $(this).html();
          // console.log('richTextEditing: '+scope.richTextEditing);
          if (!CKEDITOR.instances[editorID]) {
            loadEditor();
          } else {
            CKEDITOR.instances[editorID].destroy();
            loadEditor();
          }
          var editor = CKEDITOR.instances[editorID];
          editor.setData(scope.richTextEditing);
          // console.log('getData: '+editor.getData());
          $(modalID).modal('show');
          // Apply Rich Text Changes
          $(modalID).on('click', '*[data-apply]', function () {
            var editor = CKEDITOR.instances[editorID];
            if (editor) {
              element.find('#' + richTextID).html(editor.getData());
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
          $(modalID).on('click', '*[data-remove]', function () {
            var pageId = scope.currentPage.pageId;
            var newContent = $('#content *[compile-html]').html();
            element.find('#' + richTextID).remove();
            scope.bbcore.site.pages[pageId].content = newContent;
            scope.$apply();
            editor.destroy();
            $(modalID).modal('hide');
          });
          // Close Modal
          element.on('click', '*[data-dismiss]', function () {
            editor.destroy();
            $('#pageSettingsModal').modal('hide');
          });
        });
      },
      replace: false
    };
  }
]).directive('draggable', [
  '$document',
  function ($document) {
    return function (scope, element, attr) {
      var pos = element.position();
      var startX = 0, startY = 0;
      var x = pos.left, y = pos.top;
      // element.css({
      //   position: 'relative',
      //   border: '2px dashed #e1e1e1',
      //   cursor: 'move'
      // });
      element.on('mousedown', function (event) {
        // Prevent default dragging of selected content
        scope.$apply();
        scope.bbcore.snapShot();
        event.preventDefault();
        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });
      element.on('mouseup', function (event) {
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
          left: x + 'px'
        });
      }
      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    };
  }
]).directive('bbToolBar', [
  '$location',
  '$route',
  'Site',
  function ($location, $route, Site) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element) {
        // scope.$watch(scope.bbcore.site.pages[0], function(html) {
        //   alert('modified');
        // });
        // Undo Changes
        element.on('click', '*[data-undo]', function () {
          console.log('::scope.bbcore.site.pages:before:' + scope.bbcore.site.pages);
          console.log('::scope.bbcore.site.pages.lenght:before:' + scope.bbcore.site.pages.length);
          console.log('::scope.versions:before:' + scope.versions);
          console.log('::scope.versions:lenght:before:' + scope.versions.length);
          if (scope.bbcore.edit === true && scope.versions.length > 0) {
            var pageId = scope.currentPage.pageId;
            if (scope.versionIndex > 0) {
              scope.bbcore.site.pages = scope.versions[scope.versionIndex - 1];
              scope.versionIndex = scope.versionIndex - 1;
            } else {
            }
            console.log('::scope.bbcore.site.pages:after:' + scope.bbcore.site.pages);
            console.log('::scope.bbcore.site.pages.lenght:after:' + scope.bbcore.site.pages.length);
            console.log('::scope.versions:after:' + scope.versions);
            console.log('::scope.versions:lenght:after:' + scope.versions.length);
            scope.currentPage = scope.bbcore.site.pages.filter(function (e) {
              if (e.pageId === pageId) {
                return e;
              }
            })[0];
            scope.$apply();
          } else {
          }
        });
        // Repeat Changes data-repeat
        element.on('click', '*[data-repeat]', function () {
          if (scope.bbcore.edit === true && scope.versions) {
            console.log('Repeating...');
            console.log('scope.currentPage:Before:' + JSON.stringify(scope.currentPage));
            var pageId = scope.currentPage.pageId;
            if (scope.versionIndex + 1 < scope.versions.length) {
              scope.bbcore.site.pages = scope.versions[scope.versionIndex + 1];
              // scope.$apply();
              scope.versionIndex = scope.versionIndex + 1;
            } else {
            }
            scope.currentPage = scope.bbcore.site.pages.filter(function (e) {
              if (e.pageId === pageId) {
                return e;
              }
            })[0];
            console.log('scope.currentPage:After:' + JSON.stringify(scope.currentPage));
            scope.$apply();
          } else {
          }
        });
        // Save Page
        element.on('click', '*[data-save]', function () {
          // localStorage.bbSite01 = JSON.stringify(scope.bbcore.site);
          // scope.$apply();
          // // $route.reload(); ?$location?
          // $('#pageSettingsModal').modal('hide');
          // removeEditionAttributes();
          (function () {
            $('*').removeAttr('draggable');
            var pageId = scope.currentPage.pageId;
            var newContent = $('#content *[compile-html]').html();
            scope.bbcore.site.pages[pageId].content = newContent;  // scope.$apply();
          }());
          scope.bbcore.siteQuery[0].set('schema', JSON.stringify(scope.bbcore.site));
          scope.bbcore.siteQuery[0].save();
        });
      },
      templateUrl: 'scripts/directives/_toolbar.html',
      replace: true,
      transclude: false
    };
  }
]).directive('bbToolBox', [
  '$rootScope',
  '$location',
  '$route',
  'Site',
  function ($rootScope, $location, $route, Site) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element) {
        // Toggle Option List
        element.on('click', 'li', function () {
          var id = $(this).data('id');
          // $(id).toggle("slow");
          $(id).toggleClass('hide');
          updatePageList();
        });
        var removeEditionAttributes = function () {
          element.find('*').removeAttr('draggable');
          var pageId = scope.currentPage.pageId;
          var newContent = $('#content *[compile-html]').html();
          scope.bbcore.site.pages[pageId].content = newContent;
          scope.$apply();
        };
        /**
			 * Pages
			 */
        var updatePageList = function () {
          var currentLocation = $location.path();
          var currentLocationAnchor = '';
          if (currentLocation !== '/') {
            currentLocationAnchor = currentLocation.replace('/', '#');
          } else {
            currentLocationAnchor = currentLocation;
          }
          element.find('#page-list li a[ng-href]').parent().removeClass('active');
          element.find('#page-list li a[ng-href="' + currentLocationAnchor + '"]').parent().addClass('active');
        };
        updatePageList();
        var removeEditionAttributes = function () {
          element.find('*').removeAttr('draggable');
          var pageId = scope.currentPage.pageId;
          var newContent = $('#content *[compile-html]').html();
          scope.bbcore.site.pages[pageId].content = newContent;  // scope.$apply();
        };
        // Event Handler
        $rootScope.$on('$routeChangeSuccess', function () {
          updatePageList();  // removeEditionAttributes();
                             // scope.$apply();
        });
        // Dialog for Add New Page
        element.on('click', 'li[data-page-add]', function () {
          var modalID = '#AddPageModal';
          $(modalID).modal('show');
          $(modalID).on('click', '*[data-apply]', function () {
            var title = scope.NewPage.title;
            var url = title.split(' ').join('-').toLowerCase();
            var newPage = scope.bbcore.addPage(title, url, '<div id="bb-rich-text1" bb-element="bb-rich-text"><p>Double click here in order to edit this paragraph</p></div>');
            $location.path(newPage.url);
            scope.$apply();
            $(modalID).modal('hide');
          });
        });
        // Show Page Editor for selected page
        element.on('click', 'li *[data-page-id]', function () {
          var modalID = '#pageSettingsModal';
          var pageId = $(this).data('page-id');
          scope.beforeSite = JSON.parse(JSON.stringify(scope.bbcore.site));
          scope.PageEditing = scope.bbcore.site.pages[pageId];
          $location.path(scope.PageEditing.url);
          scope.$apply();
          $(modalID).modal('show');
          // Remove Page
          $(modalID).on('click', '*[data-remove]', function () {
            var pageId = scope.PageEditing.pageId;
            scope.bbcore.site.pages.splice(pageId, 1);
            scope.PageEditing = {};
            scope.$apply();
            $(modalID).modal('hide');
          });
          // Close Modal
          $(modalID).on('click', '*[data-dismiss]', function () {
            scope.bbcore.site = scope.beforeSite = JSON.parse(JSON.stringify(scope.beforeSite));
            scope.$apply();
            $(modalID).modal('hide');
          });
          // Apply Changes
          $(modalID).on('click', '*[data-apply]', function () {
            // alert(JSON.stringify(scope.PageEditing));
            var priorUrl = scope.beforeSite.pages[scope.PageEditing.pageId].url;
            var newUrl = scope.PageEditing.url;
            var newRoute = $route.routes['/' + priorUrl + '/'];
            var RePath = new RegExp('^/' + newUrl + '$');
            newRoute.originalPath = '/' + newUrl;
            newRoute.regexp = RePath;
            $route.routes['/' + newUrl + '/'] = newRoute;
            delete $route.routes['/' + priorUrl + '/'];
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
        element.on('click', '*[data-insert-text]', function () {
          var richTextCount = $('*[bb-element="bb-rich-text"]').length;
          var uuid = generateUid();
          // console.log(richTextCount.length);
          var left = 460 + richTextCount * 32;
          var top = 120 + richTextCount * 32;
          richTextCount += 1;
          $('#content *[compile-html]').append($('<div id="bb' + uuid + '"' + ' bb-element="bb-rich-text" style="left:' + left + 'px; ' + 'top:' + top + 'px; position:absolute"><p jqyoui-draggable="{data-drag: \'true\'}">I\'m a paragraph, double click here in order to add<br/>your own text.</p></div>'));  // scope.$apply();
        });  /**
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
  }
]);
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