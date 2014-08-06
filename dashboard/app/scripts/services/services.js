'use strict';

var siteSchema = {
  siteName: '',
  metaData: {
    siteTitle : '',
    keywords: '',
    description: '',
  },
  design: {
    theme: 'demo',
    customCSS: '/path/',
    favicon: '/path/',
    logo: '/path/',
    appIcons: {
      ios:
        {0: '/* IOS ICONS */'},
      android:
        {0: '/* ANDROID ICONS */'},
      windows:
        {0: '/* WINDOWS ICONS */'},
      blackberry:
        {0: '/* BLACKBERRY ICONS */'},
      kindle:
        {0: '/* KINDLE ICONS */'},
      tizen:
        {0: '/* TIZEN ICONS */'}
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
          card:'summary_large_image',
          site:'http://mysite.com',
          title:'Page Title',
          description:'Description of the page',
          creator:'Babel Blogs, LLC'
        },
        openGraph: {
          title: '',
          type: '',
          url: '',
          image: '',
          description: '',
          site_name:'Babel Blogs Demo'
        },
        seo: {
          title: '',
          description: ''
        }
      },
      content: '<div id="bb-rich-text2" bb-element="bb-rich-text"><h2>Welcome to your new website, double click this paragraph to edit.</h2></div>'
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
          card:'summary_large_image',
          site:'http://mysite.com',
          title:'Page Title',
          description:'Description of the page',
          creator:'Babel Blogs, LLC'
        },
        openGraph: {
          title: '',
          type: '',
          url: '',
          image: '',
          description: '',
          site_name:'Babel Blogs Demo'
        },
        seo: {
          title: '',
          description: ''
        }
      },
      content: '<div id="bb-rich-text1" bb-element="bb-rich-text" style="width: 460px;"><p>I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me and you can start adding your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.\
        <br/><br/>This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business.</p></div>'
    }
  ]
};

angular.module('dashboardApp')

  /**
   * User
   */
  .factory('user', function($location, $rootScope) {
    return {
      logIn: function(username, password) {
        $rootScope.$broadcast('event:sessionUpdated');
        return Parse.User.logIn(username, password);
      },
      logOut: function() {
        Parse.User.logOut();
        $rootScope.$broadcast('event:sessionUpdated');
        this.isLogin = false;
      },
      current: function() {
        return Parse.User.current();
      },
      isAuthenticated: function() {
        if ( Parse.User.current() ) {
          this.isLogin = true;
          return true;
        }
        else {
          this.isLogin = false;
          return false;
        }
      },
      getName: function() {
        // Code Here!
      },
      isLogin: false,
      name: '',
    };
  })



  /**
   * Site
   */
  .factory('Site', function($rootScope) {
    var Site = {
      server: 'bblogs.co:9000',
      // Function which creates a new site for the current user.
      addNewSite: function(options) {
        var Site = Parse.Object.extend('Site');
        var site  = new Site();
        var userId = Parse.User.current().id;

        var siteTitle = options.siteTitle || '';
        var siteUrl = options.siteUrl || '';

        var newSchema = JSON.parse( JSON.stringify(siteSchema) );
        newSchema.siteName = siteTitle;

        site.set('url', siteUrl);
        site.set('title', siteTitle);
        site.set('userId', userId);
        site.set('schema', JSON.stringify(newSchema));
        // TODO: User promise
        site.save(null, {
          success: function(site) {
            // alert('New object created with objectId: ' + site.id);
            window.location.href = '/site/new?id='+site.id;
          },
          error: function(site, error) {
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });
      },
      sites: [],

      // Function which returns all the exiting sites for the current user.
      getAll: function() {
        if (Parse.User.current() ) {
          var userId = Parse.User.current().id;
          var query = new Parse.Query('Site');
          var sites = {};
          var parentObjt = this;

          query.equalTo('userId', userId);
          query.find().then(function(sites) {
            // alert(JSON.stringify(sites));
            sites = JSON.parse(JSON.stringify(sites));
            parentObjt.sites = sites;
            $rootScope.$apply();
          },function(error) {
            alert(error.message);
          });
        }
        else {
          return false;
        }
      }
    };
    return Site;
  });