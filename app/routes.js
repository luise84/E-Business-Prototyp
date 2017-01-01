// grab the node model we just created
var Node = require('./models/node');
var View = require('./models/view');

//REST operations ==============================================================
var error00 = {type: "error", statusCode: 400, message: "Bad Request"};
var error04 = {type: "error", statusCode: 404, message: "Requested resource not found"};


    module.exports = function(app) {
    	// server routes ===========================================================
        // handle things like api calls
        // authentication routes
        /*-------------------------------Views--------------------------------------*/
        app.get('/api/views', function(req, res){
            // use mongoose to get all nerds in the database
            var query = {};
            if(req.query.name) query.name = new RegExp(req.query.name, 'i'); //i->case-insensitive
            if(req.query.nodes) query.nodes = new RegExp(req.query.nodes, 'i');
            
            if(query.length != 0){
                View.find(query).exec(function(err, views) {
                if (err) res.send(err);
                res.status(200).json(views);
            });
            }

            else{
                View.find(function(err, views) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                    if (err)
                        res.send(err);
                    res.setHeader("content-type", "application/json");
                    res.status(200).json(views); // return all nerds in JSON format
                });
            }

        });
        app.post('/api/views', function(req, res){
            if(req.body.name === undefined || req.body.nodes === undefined){  
                    
                res.setHeader("content-type", "application/json");
                res.status(400).json(error00);
            
              }
          else{
            var view = new View();                      
        
            view.name = req.body.name ;
            view.nodes = req.body.nodes || [];
           
            view.save(function(error){
                if(error) res.send(error00);
                res.setHeader("content-type", "application/json");
                res.status(201).json(view);
            });
        }

        });
        app.get('/api/views/:view_id', function(req, res){
            View.findById(req.params.view_id, function(error, view){
                if(error) res.status(404).json(error04);
                else if(view == null) res.status(404).json(error04);
                else {
                    res.setHeader("content-type", "application/json");
                    res.status(200).json(view);
                }
            })
        });
        app.put('/api/views/:view_id', function(req, res){
            View.findById(req.params.view_id, function(error, view){
                if(error) res.send(error04);
                else{
                    if(req.body === undefined) res.status(400).json(error00);
                    else{
                        if(req.body.name !== undefined) view.name = req.body.name;
                        if(req.body.nodes !== undefined) view.nodes = req.body.nodes;
                        
                        view.save(function(error){
                            if(error) res.send(error);
                            res.status(200).json(view);
                        });
                    }
                }
            });
        });
        app.delete('/api/views/:view_id', function(req, res){
            View.remove({_id: req.params.view_id}, function(error, view){
                if(error) res.status(4040).json(error04);
                res.status(204).json({message:"Deleted"});
            });
        });


        /*-------------------------------Nodes--------------------------------------*/
        // sample api route
        app.get('/api/nodes', function(req, res) {
            // use mongoose to get all nerds in the database
            var query = {};
            if(req.query.name) query.name = new RegExp(req.query.name, 'i'); //i->case-insensitive
            if(req.query.content) query.content = new RegExp(req.query.content, 'i');
            if(req.query.keywords) query.keywords = new RegExp(req.query.keywords, 'i');

            if(query.length != 0){
            	Node.find(query).exec(function(err, nodes) {
    			if (err) res.send(err);
    			res.status(200).json(nodes);
  			});
            }

            else{
            	Node.find(function(err, nodes) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
	                if (err)
	                    res.send(err);
	                res.setHeader("content-type", "application/json");
	                res.status(200).json(nodes); // return all nerds in JSON format
            	});
            }
        });

        // route to handle creating goes here (app.post)
        app.post('/api/nodes', function(req, res){
        	if(req.body.name === undefined || req.body.content === undefined){	
					
    			res.setHeader("content-type", "application/json");
    			res.status(400).json(error00);
			
		      }
		  else{
			var node = new Node();						
		
			node.name = req.body.name ;
			node.content = req.body.content;
			node.keywords =  req.body.keywords || [];

			node.save(function(error){
				if(error) res.send(error00);
				res.setHeader("content-type", "application/json");
				res.status(201).json(node);
			});
		}
        	
        });
        // route to handle finding goes here (app.get)
        app.get('/api/nodes/:node_id',function(req, res){
        	Node.findById(req.params.node_id, function(error, node){
        		if(error) res.status(404).json(error04);
        		else if(node == null) res.status(404).json(error04);
        		else {
        			res.setHeader("content-type", "application/json");
        			res.status(200).json(node);
        		}
        	})
        });

        // route to handle updating goes here (app.put)
        app.put('/api/nodes/:node_id', function(req, res){
        	Node.findById(req.params.node_id, function(error, node){
        		if(error) res.send(error04);
        		else{
        			if(req.body === undefined) res.status(400).json(error00);
        			else{
                        if(req.body.name !== undefined) node.name = req.body.name;
                        if(req.body.content !== undefined) node.content = req.body.content;
                        if(req.body.keywords !== undefined) node.keywords = req.body.keywords;
                        
                        node.save(function(error){
                            if(error) res.send(error);
                            res.status(200).json(node);
                        });
                    }
        		}
        	});
        });
        // route to handle delete goes here (app.delete)
        app.delete('/api/nodes/:node_id', function(req, res){
        	Node.remove({_id: req.params.node_id}, function(error, node){
        		if(error) res.status(4040).json(error04);
        		res.status(204).json({message:"Deleted"});
        	});
        });

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };

