'use strict';

angular.module('blogTemplateApp')

.factory('Site', function () {
	if (localStorage.bbSite01) {
		var siteSchema = JSON.parse(localStorage.bbSite01);
	}
	else {
		var siteSchema = {
			name: 'Simple Blog',
			slogan: 'Keep it Simple!',
			pages: [
				{
					id: 0,
					title: 'Home',
					description: 'Home Page.',
					type: 'page',
					content: '<h2>Welcome To <small>Simple Blog.</small></h2>',
					url: '/'
				},
				{
					id: 1,
					title: 'About Us',
					description: 'About Us.',
					type: 'page',
					content: '<div class="row"><div class="col-md-12" bb-element bb-rich-text><p>Here you can read About Us</p></div></div>',
					url: 'about'
				},
				{
					id: 2,
					title: 'Products',
					description: 'List of Products we provide.',
					type: 'gallery',
					content: '<div class="row"><div class="col-md-12"><p> Check Our Products</p></div></div>',
					url: 'products'
				},
				{
					id: 3,
					title: 'Services',
					description: 'List of Services we provide.',
					type: 'form',
					content: '<h1>Our Services</h1>',
					url: 'services'
				},
				{
					id: 4,
					title: 'Blog',
					description: 'News Content',
					type: 'form',
					content: '<h1>Our Blog</h1>',
					url: 'services'
				},
				{
					id: 5,
					title: 'Contact Us',
					description: 'Contact Page.',
					type: 'form',
					content: '<form action="" method="get" accept-charset="utf-8">'+'<input type="text" name="" value="" placeholder="Subject">'+'</form>',
					url: 'contact'
				}
			]
		};
	}
	return siteSchema;
});