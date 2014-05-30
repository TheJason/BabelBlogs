'use strict';

angular.module('babelBlogsApp')

/**
 * Main Navigation
 */
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


/**
 * Push Right Menu
 */
.directive('nguiPushMenu', function($rootScope, $location) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var setCurrentItem = function () {
				var currentLocation = $location.path();
				var currentLocationAnchor = '';

				if (currentLocation !== '/') {
					currentLocationAnchor = currentLocation.replace('/', '#');
				}
				else {
					currentLocationAnchor = currentLocation;
				}
				// Add 'active' class to menu item that match the view url
				element.find('li')
					  .removeClass('active');

				element.find('a[ng-href="' + currentLocationAnchor + '"]')
					.parent()
						.addClass('active');
		  };
		  setCurrentItem();

			$rootScope.$on('$routeChangeStart', function(event, next) {
	      if (next.originalPath === '/' && next.redirectTo === '/') {
	        // Do Something
	      }
	      else {
	        setCurrentItem();
	      }
	    });
		},
		templateUrl: 'scripts/directives/_push_right_menu.html',
		replace: true,
	};
})


/**
 * Bootstrap 3 Accordion
 */
.directive('nguiAccordion', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			console.log('Accordion: ' + element);
			console.log('QuestionField: ' + element.data('question-field'));
			console.log('AnswerField: ' + element.data('answer-field'));
			console.log('QuestionList: ' + element.data('question-list'));
			console.log('QuestionList: ' + scope[element.data('question-list')] );
			
			element.on('click', '.panel', function(event) {
				console.log('AccordionClicked: ');
				// element.find('.collapse')
				// 	.remove('toggle');

				// $(this).find('.collapse')
				// 	.collapse('toggle');

				$(this).find('.collapse')
					.toggleClass('in');
			});

			var TitleField = element.data('question-field');
			var DescriptionField = element.data('answer-field');

			var findTitle = '\"'+TitleField+'\":';
			var findDescription = '\"'+DescriptionField+'\":';

			var reTitle = new RegExp(findTitle, 'g');
			var reDescription = new RegExp(findDescription, 'g');

			scope.accordionItems = JSON.parse( JSON.stringify(scope[element.data('question-list')]).replace(reTitle, '\"title\":').replace(reDescription, '\"description\":') );//.replace(/\"+TitleField+\":/g, '\"title\":').replace('\"'+DescriptionField+'\":', '\"description\":') );
			console.log('scope.accordionItems: ' + scope.accordionItems);
		},
		templateUrl: 'scripts/directives/_accordion.html',
		replace: true,
	};
});