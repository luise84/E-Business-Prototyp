//modules
var express = require('express');
var app = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var request = require('request');
var cheerio= require('cheerio');




// configuration ===========================================
    
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
 mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


// routes ==================================================
require('./app/routes')(app); // configure our routes

app.use(request);
app.use(cheerio);

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);


/* ---------------------web scraping--------------------*/
/*var url = "https://de.wikipedia.org/wiki/Baum";
var baseurl = "https://de.wikipedia.org";
var sublinks = [];
request(url, function (error, res, html){
	if(!error){
		// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

        var $ = cheerio.load(html);

        // Finally, we'll define the variables we're going to capture

        var title, content, childLinks;
        var json = { title : "", content : "", children : ""};

        //Heading- starting point

       	$('#firstHeading').filter(function(){
       		var data = $(this);
       		title = data.text();
       		json.title = title;
       	});
       	var url ="";
      	var links = $("a").each(function(i, link){
          	url = $(link).attr("href");  
          	subtitle = $(link).attr("title");
          	if(subtitle) json.children += subtitle+",";        	
          	if(url && ! url.startsWith("/wiki/Datei:")){          		
      			if(url.startsWith("/wiki")){
          		url = baseurl + url.replace('/wiki', '');
          		sublinks.push(url);          		
	          	}
	          	else return; //only wikipedia internal sites
      		
	          	
	        }


          });
      	
          console.log(json);
      
         

	}
})*/




// expose app        

exports = module.exports = app;  


