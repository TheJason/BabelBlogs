'use strict';

// ExpressJS
var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');

app.use('/site/:site_name', function(req, res, next){

    if (req.url !== '/') {
      // console.log('true');
      // console.log(req.url);
      if (req.url && req.url.slice(0,1) === '/' && req.url !== '/') {
        // console.log(':1:req.url:' + req.url);
        req.url = req.url.slice(1);
        // console.log(':2:req.url:' + req.url);
      }
    }
    else {
      console.log('false');
      console.log(req.url);
    }
    return next();
});


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



/**
 * App configuration section
 */
app.set('views', 'sites');  // Folder containing view templates
app.engine('html', require('ejs').renderFile);    // Template engine

// app.use('/Y4KkHHrfrQ', express.static('sites/Y4KkHHrfrQ'));
 
// Attach the Express app
app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');