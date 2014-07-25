var express = require('express');
var app = express();
 
// App configuration section
// app.set('views', 'cloud/views');  // Folder containing view templates
// app.set('view engine', 'ejs');    // Template engine
app.use(express.bodyParser());    // Read the request body into a JS object
 
// Attach request handlers to routes

app.get('/site', function(req, res) {  
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

app.get('/test', function(req, res) {
  // GET http://example.parseapp.com/test?message=hello
  // res.render('test.ejs', { text: req.query.message });  // Render a template
  res.json({message: 'ExpressJS is working!!'});
});
 
 
// Attach the Express app
app.listen();