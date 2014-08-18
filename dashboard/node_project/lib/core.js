'use strict';

// ExpressJS
var express = require('express');
var app = express();

/**
 * App configuration section
 */ 
app.set('views', 'sites');  // Folder containing view templates
app.engine('html', require('ejs').renderFile);    // Template engine

app.use('/Y4KkHHrfrQ', express.static('sites/Y4KkHHrfrQ'));
 
// Attach the Express app
app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');