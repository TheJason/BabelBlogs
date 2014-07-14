'use strict';
/*jshint multistr: true */
angular.module('blogTemplateApp')

.factory('Site', function () {
	if (localStorage.bbSite01) {
		var siteSchema = JSON.parse(localStorage.bbSite01);
	}
	else {
		var siteSchema = {
			name: 'Dental Solutions',
			slogan: 'Keep it Simple!',
			pages: [
				{
					id: 0,
					title: 'Home',
					description: 'Home Page.',
					type: 'page',
					content: '<div class="row">\
						<div class="col-md-6">\
							<div id="bb-rich-text1" bb-element bb-rich-text><img src="/images/custom/dentist.jpg" alt=""></div>\
						</div>\
						<div class="col-md-6">\
							<div id="bb-rich-text2" bb-element bb-rich-text><h2>We are experts in dental solutions.</h2></div>\
						</div>\
						</div>',
					url: '/'
				},
				{
					id: 1,
					title: 'About Us',
					description: 'About Us.',
					type: 'page',
					content: '<div class="row center"><div class="col-md-5"><div id="bb-rich-text1" draggable bb-element bb-rich-text><p>I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.\
​\
<br/><br/>This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business.</p></div></div>\
<div class="col-md-6" bb-element bb-rich-text>\
							<img src="/images/custom/dentist02.jpg" alt="" width="320">\
						</div>\
</div>',
					url: 'about'
				},
				{
					id: 2,
					title: 'Products',
					description: 'List of Products we provide.',
					type: 'gallery',
					content: '<div class="row"><div class="col-md-12"><div id="bb-rich-text1" bb-element bb-rich-text><p> Check Our Products</p></div></div></div>',
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
					content: '<form action="contact_submit" method="get" accept-charset="utf-8" role="form">\
          <div class="form-group">\
            <label for="name">Name</label>\
            <input type="text" class="form-control" name="name" value="" placeholder="Name">\
          </div>\
\
          <div class="form-group">\
            <label for="email">E-mail Address</label>\
            <input type="email" class="form-control" name="email" value="" placeholder="E-mail">\
          </div>\
\
          <div class="form-group">\
            <label for="department">Department</label>\
            <select class="form-control" name="department">\
              <option value="sales">Sales</option>\
              <option value="support">Support</option>\
              <option value="general_inquiry">General Inquiry</option>\
              <option value="billing">Billing</option>\
              <option value="domain_routing">Domain Routing</option>\
              <option value="legal">Legal</option>\
            </select>\
          </div>\
\
          <div class="form-group">\
            <label for="department">Message</label>\
            <textarea class="form-control" name="message"></textarea>\
          </div>\
\
          <button type="submit" class="btn btn-default">Submit</button>\
        </form>',
					url: 'contact'
				}
			]
		};
	}
	return siteSchema;
});