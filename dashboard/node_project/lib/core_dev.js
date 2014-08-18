'use strict';

// File System
var fs = require('fs.extra');

var path = require('path');

// ExpressJS
var express = require('express');
var app = express();


/**
 * Parse SDK
 */
var Parse = require('parse').Parse;
Parse.initialize('SJ00HRyBkPc30iFhTkn0Oopo3GymfYlnKpaecN3m', 'c3ytYcMIQhYv6joutebIQIKNlCJJDYva0JNKK8sc');


/**
 * App configuration section
 */
app.set('views', 'sites');  // Folder containing view templates
app.engine('html', require('ejs').renderFile);    // Template engine

// app.use('/site/Y4KkHHrfrQ', express.static('sites/Y4KkHHrfrQ'));
app.use('/dashboard', express.static('bb_dashboard'));
app.use('/', express.static('bb_marketing'));


// middleware that gets a named param
app.use('/site/:site_name', function(req, res, next){
    // removes url starts with slash
    // if (req.url.slice(0,1) === '/') {
    //   req.url = req.url.slice(1);
    // }
    console.log(':1:req.url:' + req.url);

    // create site path
    var sitePath = path.join(__dirname, 'sites/' + req.param('site_name'));
    // console.log(':1:req.url:' + req.url);
    // if (req.url !== '/') {
    //   // console.log('true');
    //   // console.log(req.url);
    //   if (req.url && req.url.slice(0,1) === '/' && req.url !== '/') {
    //     console.log(':1:req.url:' + req.url);
    //     req.url = req.url.slice(1);
    //     console.log(':2:req.url:' + req.url);
    //   }
    // }
    // else {
    //   console.log('false');
    //   console.log(req.url);
    // }
    
    // console.log(':2:req.url:' + req.url);
    // console.log('::sitePath:'+sitePath);
    // console.log('::__dirname:' + __dirname);
    // console.log('::req.param(\'site_name\'):' + req.param('site_name'));
    // console.log('::sitePath:' + 'sites/' + req.param('site_name') );
    // req.path = '/none';
    // console.log(JSON.stringify(req.path));
    // req['path'] = req.path.replace(/^\//, '');
    // console.log('::req.path:' + 'sites/' + req.path.replace(/^\//, ''));

    // console.log('::rewritedPath:' + 'sites/' + req.param('site_name') + req.path );
    
    // check it if exists on the file system
    fs.exists(sitePath, function(exists){
        // if not move to next piece of middleware
        if (!exists) {
          // console.log('::DoNotExistsSitePath:'+sitePath);
          return next();
        }
        // if it does run express.static to return
        // a middlware function to handle that path
        // then run that function and pass it the req,res,next params
        return express.static(sitePath)(req,res,next);
    });
});


app.get('/redi', function(req, res) {
	res.redirect('/redo/');
});


app.get('/redo', function(req, res) {
	res.send('<h1>Works!</h1>');
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
          createSchema();
          createConfing();
          res.redirect('/site/'+siteID);
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
        console.log(configFileContent);
        // fs.readFile('./fixtures/config.txt', function(err, data) {
        //   if (err) {
        //     throw err;
        //   }
        //   configFileContent = data.toString('utf8');
        //   configFileContent = configFileContent
        //     .replace('[site_id]', '\''+siteID+'\'')
        //     .replace('[site_author]', '\'\'');
        //   console.log(configFileContent);
        //   createConfing();
        // });
        fs.writeFileSync('./sites/' + siteID + '/config.js', configFileContent);
      };      
    }
    else {
      res.json({error: siteID+' not found...'});
    }
  });
});


// Attach the Express app
app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');