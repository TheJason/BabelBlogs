'use strict';

// var babelblogsDashboard = require('../lib/babelblogs-dashboard.js');

// babelblogsDashboard.awesome();
// // => awesome

// File System
var fs = require('fs.extra');

// ExpressJS
var express = require('express');
var app = express();



/**
 * App configuration section
 */ 
app.set('views', 'sites');  // Folder containing view templates
app.engine('html', require('ejs').renderFile);    // Template engine
// app.use(express.bodyParser());    // Read the request body into a JS object
// app.use('/web', express.static('static'));

app.use('/Y4KkHHrfrQ', express.static('sites/Y4KkHHrfrQ'));
// app.use(express.static('sites/Y4KkHHrfrQ'));


/**
 * Parse SDK
 */ 
var Parse = require('parse').Parse;
Parse.initialize('SJ00HRyBkPc30iFhTkn0Oopo3GymfYlnKpaecN3m', 'c3ytYcMIQhYv6joutebIQIKNlCJJDYva0JNKK8sc');


 
/**
 * Attach request handlers to routes
 */ 

// Returns the schema for the requested website
// Required: arg[id]
app.get('/api/v1/site', function(req, res) {
  if (req.query.id) {
    var siteID = req.query.id;
    var query = new Parse.Query('Site');
    query.equalTo('objectId', siteID);
    query.find().then(function(site) {
      var Site = JSON.parse(site[0].get('schema'));
      if (Site) {
        console.log( 'Schema'+JSON.parse(site[0].get('schema') ) );
        res.json({site: Site});
      }
      else {
        res.json({error: siteID+' not found...'});
      }
    });
  }
  else {
    res.json({error: 'No site ID provided'});
  }
});


app.get('/site', function(req, res) {  
  res.render('Y4KkHHrfrQ/index.html', {});  // Render a template
  // if (req.query.id) {
  //   var siteID = req.query.id;

  // }
  // else {
  //   res.json({error: 'No site ID provided'});
  // }
});


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
          // Create a JSON file
          fs.writeFile('./sites/' + siteID + '/schema.json', site[0].get('schema'), function(err) {
              if(err) {
                  console.log(err);
              } else {
                  res.send('The site was created!');
              }
          });
        }
			});      
    }
    else {
      res.json({error: siteID+' not found...'});
    }
  });
});


// Attach the Express app
app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');