'use strict';

// File System
var fs = require('fs.extra');

var path = require('path');
var vhost = require('vhost');

// Express JS Apps
var express = require('express');

var app = express();
var marketingApp = express();
var dashboardApp = express();
var blogEngineApp = express();



/**
 * Parse SDK
 */
var Parse = require('parse').Parse;
Parse.initialize('SJ00HRyBkPc30iFhTkn0Oopo3GymfYlnKpaecN3m', 'c3ytYcMIQhYv6joutebIQIKNlCJJDYva0JNKK8sc');



/**
 * Marketing Site App
 */
marketingApp.use('/', express.static('bb_marketing'));
marketingApp.get('/testing', function(req, res) {
  res.send('Testing vHost!');
});



/**
 * Blog Engine App
 */
blogEngineApp.engine('html', require('ejs').renderFile);    // Template engine
dashboardApp.use('/', express.static('bb_dashboard'));

// middleware that gets a named param
//d5OJocYaB4
//Y4KkHHrfrQ
blogEngineApp.use('/', function(req, res, next) {
    var site_name = req.vhost[0];
    console.log('::site_name: ' + site_name);
    // create site path
    var siteUrl = '';
    var query = new Parse.Query('Site');
    query.equalTo('url', site_name);
    query.find().then(function(site) {
      var Site = site[0];
      if (Site) {
        siteUrl = Site.url;
        var sitePath = path.join(__dirname, 'sites/' + Site.id);
        console.log('::sitePath: ' + sitePath);

        // check it if exists on the file system
        fs.exists(sitePath, function(exists){
            // if not move to next piece of middleware
            if (!exists) {
              return next();
            }
            // if it does run express.static to return
            // a middlware function to handle that path
            // then run that function and pass it the req,res,next params
            return express.static(sitePath)(req, res, next);
        });
      }
      else {
        res.json({error: site_name+' not found...'});
      }
    });
    
});

// blogEngineApp.get('/', function(req, res) {
//   var site_name = req.vhost[0];
//   console.log('::site_name: ' + site_name);
//   res.send('Site Name Is: '+site_name);
// });


// Create a new site using the template1
app.get('/site/new', function(req, res) {
  var siteID = req.query.id;
  var templateID = '';
  if (req.query.template) {
    templateID = req.query.template;
  }
  else {
    templateID = 'template1';
  }
  var query = new Parse.Query('Site');
  query.equalTo('objectId', siteID);
  query.find().then(function(site) {
    var Site = JSON.parse(site[0].get('schema'));
    if (Site) {
      console.log( 'Schema'+JSON.parse(site[0].get('schema') ) );
      
      // Copy template
      fs.copyRecursive('./bb_templates/'+templateID, './sites/'+siteID, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('Copied '+'./bb_templates/' + templateID +' to ' + 'sites/' + siteID);
          createSchema();
          createConfing();
          console.log('url', site[0].get('url'));
          console.log(('http://' + site[0].get('url') + '.bblogs.co:9000'));
          res.redirect('http://' + site[0].get('url') + '.bblogs.co:9000');
        }
      });
      
      // Create Schema JSON file
      var createSchema = function() {
        fs.writeFileSync('./sites/' + siteID + '/schema.json', site[0].get('schema'));
      };
      
      // Adds Config File
      var createConfing = function() {
        var configFileContent = fs.readFileSync('./fixtures/config.txt', 'utf8');
        configFileContent = configFileContent
          .replace('[site_id]', '\''+siteID+'\'')
          .replace('[site_author]', '\'\'');
       
        fs.writeFileSync('./sites/' + siteID + '/config.js', configFileContent);
      };
    }
    else {
      res.json({error: siteID+' not found...'});
    }
  });
});

// add vhost routing for main app
app.use(vhost('bblogs.co', marketingApp));
app.use(vhost('www.bblogs.co', marketingApp));

app.use(vhost('dashboard.bblogs.co', dashboardApp));

// listen on all subdomains for user pages
app.use(vhost('*.bblogs.co', blogEngineApp));

// Attach the Express app
app.listen(9000, '0.0.0.0');
console.log('Server running at http://0.0.0.0:9000/');