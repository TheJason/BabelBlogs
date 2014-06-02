'use strict';

angular.module('babelBlogsApp')

.controller('GlobalCtrl', ['$scope', '$location', 'ui',
	function($scope, $location, ui) {
		$scope.ui = ui;
		$scope.ui.showMenu = false;
		$scope.ui.homePage = false;

		// Detect if HomePage is curent
		if ( $location.path() === '/' ) {
			$scope.ui.homePage = true;
		}
		else {
			$scope.ui.homePage = false;
		}

		// Hide Push Right Menu
		var hideMenu = function() {
			if ($scope.ui.showMenu === true) {
				$scope.ui.showMenu = false;
			}
		};
		$scope.hideMenu = function(){return;};
		
		// Toggle Push Right Menu
		$scope.toggleMenu = function() {
			if ($scope.ui.showMenu) {
				$scope.ui.showMenu = false;
				$scope.hideMenu = function(){return;};
			}
			else {
				$scope.ui.showMenu = true;
				// $scope.hideMenu = hideMenu;
			}
	  };
  }
])


/**
 * Main Controller
 */
.controller('MainCtrl', ['$scope', '$rootScope', '$location', 'ui',
	function($scope, $rootScope, $location, ui) {
		$scope.ui = ui;
		$scope.ui.homePage = true;
		$scope.ui.showMenu = false;
		//
		// if ( $location.path() === '/' ) {
		// 	$scope.ui.homePage = true;
		// 	alert('you are in the home page');
		// }
		// else {
		// 	$scope.ui.homePage = false;
		// 	$scope.ui.homePage = true;
		// 	alert('you are in a sub-page');
		// }

		// Trigger when switch between subpages.
    $rootScope.$on('$routeChangeStart', function(event, next) {
      $scope.ui.showMenu = false;
      if (next.originalPath === '/' && next.redirectTo === '/') {
        $scope.ui.homePage = true;
      }
      else {
        $scope.ui.homePage = false;
      }
    });
  }
])


/**
 * Blog Controller
 */
.controller('BlogCtrl', ['$scope', 'blogPosts',
	function($scope, blogPosts) {
		$scope.articles = blogPosts.articles;
	}
])


/**
 * Blog Entry Controller
 */
.controller('BlogEntryCtrl', ['$scope', '$routeParams', 'blogPosts',
	function($scope, $routeParams, blogPosts) {
		$scope.article = blogPosts.articles[$routeParams.id];
	}
])


/**
 * FAQ Controller
 */
.controller('FAQCtrl', ['$scope',
	function($scope) {
		$scope.questions = [
			{
				id: 0,
			  question: 'If this then that?',
			  answer: 'Yes'
			},
			{
				id: 1,
				question: 'If this then that?',
				answer: 'No'
			},
			{
				id: 2,
				question: 'If this then that?',
				answer: 'Maybe'
			},
			{
				id: 3,
				question: 'If this then that?',
				answer: 'You are right'
			},
			{
				id: 4,
				question: 'If this then that?',
				answer: 'Look at this post...'
			},
		];

	}
]);