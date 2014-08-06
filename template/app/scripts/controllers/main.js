'use strict';

angular.module('babelBlogsApp')

.controller('GlobalCtrl', ['$scope', '$location', 'ui', 'user',
	function($scope, $location, ui, user) {
		$scope.ui = ui;
		$scope.ui.showMenu = false;
		$scope.ui.homePage = false;
    $scope.user = user;

    // $scope.user.logIn('dev', 'default');
    // console.log('isAuthenticated: '+$scope.user.isAuthenticated());

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

    // Log Out
    $scope.logOut = function() {
      // Logout current user
      $scope.user.logOut();

      // Redirect to Main View
      $location.path('/login');
    };
  }
])



/**
* Sign In Controller
*/
.controller('SignInCtrl', ['$scope', '$location', 'user',
  function($scope, $location, user) {
    // User Data
    $scope.user = user;

    /**
     * Function which verify if user is Authenticathed
     * If user is authenticated then redirects to main view
     */
    (function() {
      if ( user.current() ) {
        $scope.user.isLogin = false;
        $location.path('/');
        alert('You are currently logged');
      }
    })();


    // Function that Create a Session if username and password are valid.
    $scope.SignIn = function() {
      // alert('SignIn...');
      if ( !user.current() ) {
        /**
         * Validate Inputs
         */
         // alert('Verifying inputs...');
        // Check if the username is provided
        if (!$scope.login.name) {
          alert('Missing User Name', 'Please provide a valid user name.');
          $scope.hide();
          return;
        }
        else if (!$scope.login.password) {
          alert('Missing Password', 'Please provide a password.');
          $scope.hide();
          return;
        }

        /**
         * Try to log in
         */
        // alert('Trying to log in...');
        user.logIn($scope.login.name, $scope.login.password).then(function(user) {
          // alert('Logged...');
          $scope.user.isLogin = true;
          // Clear Form data
          $scope.login.password = '';
          $scope.login.name = '';

          // Redirect to main View if sign in success
          $location.path('/');
          $scope.$apply();
        },function(error) {
          $scope.user.isLogin = false;
          alert('Error: ' + error.message);
          // Clear password field when sign in fail
          $scope.login.password = '';
        });
      }
      else {
        // Redirect to main View if the user is currently loged
        $location.path('/');
      }
    };
  }
])



/**
 * SignUp Controller
 */
.controller('SignUpCtrl', ['$scope', '$location', 'user',
  function($scope, $location, user) {
    // User Data
    $scope.user = user;
    $scope.newUser = {};

    // Set current date
    // var d = new Date();
    // var curr_date = d.getDate();
    // var curr_month = d.getMonth();
    // var curr_year = d.getFullYear();
    // $scope.newUser.birthday = curr_year + '-' + ('0'+(curr_month+1)).slice(-2) + '-' + curr_date;

    // // Set user gender to 'male' by defaul
    // $scope.newUser.gender = 'm';

    /**
     * Function which verify if user is Authenticathed
     * If user is authenticated then redirects to main view
     */
    (function() {
      if ( user.current() ) {
        $scope.user.isLogin = false;
        $location.path('/');
      }
    })();

    // Alert dialog
    // $scope.showAlert = function(title, message, callback) {
    //   var alertPopup = $ionicPopup.alert({
    //     title: title,
    //     template: message
    //   });
    //   alertPopup.then(function(res) {
    //     if (callback) {
    //       callback();
    //     }
    //   });
    // };

    // Function that set new user 'gender' value.
    // $scope.newUserGender = function(gender) {
    //   if (gender !== $scope.newUser.gender) {
    //     $scope.newUser.gender = gender;
    //   }
    // };

    // Function wich redirects to provided path
    $scope.go = function(path) {
      $location.path(path);
    };
    
    /**
     * Function that Creates a new user and redirect to main view
     */
    $scope.SignUp = function() {
      // Create a New User Object
      var user = new Parse.User();

      /**
       * Validate Inputs
       */
      if (!$scope.newUser.name) {
        alert('Missing user name', 'Please provide a valid user name.');
        return;
      }
      else if (!$scope.newUser.email) {
        alert('Missing E-mail', 'Please provide a valid e-mail.');
        return;
      }
      else if (!$scope.newUser.password) {
        alert('Missing password', 'Please provide a password.');
        return;
      }

      // Populated user with provided form data
      user.set('username', $scope.newUser.name);
      user.set('email', $scope.newUser.email);
      user.set('password', $scope.newUser.password);
      user.set('birthday', $scope.newUser.birthday);
      user.set('gender', $scope.newUser.gender);

      // Save new user data
      user.signUp(null).then(function(user) {
        $scope.newUser = {};
        $location.path('/');
        $scope.$apply();
      }, function(error) {
        alert('Error:' + error.message);
      });
    };
  }])



/**
 * Log Out Controller
 */
.controller('LogOutCtrl', ['$scope', '$location', 'user',
  function ($scope, $location, $ionicLoading, user) {
    // User Data
    $scope.user = user;

    // Logout current user
    $scope.user.logOut();

    // Redirect to Main view
    $location.path('/login');
    $scope.hide();
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
 * Testimonials Controller
 */
.controller('TestimonialsCtrl', ['$scope',
	function($scope) {
		$scope.testimonials = [
			{
				id: 0,
				testimonial: 'I only speak <strong>Indonesian</strong> but my blog can speaks over 40-different languages!',
				image: 'images/people04.png'
			},
			{
				id: 1,
				testimonial: 'My <strong>soccer blog</strong> has fallowers from all over the world. Thanks to Babel Blogs',
				image: 'images/people05.png'
			},
			{
				id: 2,
				testimonial: 'My business just became <strong>International</strong>, and now, so is my website. Thanks to Babel Blogs',
				image: 'images/people06.png'
			}
		];
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