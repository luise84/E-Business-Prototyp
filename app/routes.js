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
            Node.find({"parent": "/"}).exec((err, nodes) => {
                if (err) res.send(err);
                
                res.setHeader("content-type", "application/json");
                res.status(200).json(nodes);
            });
        });
        app.post('/api/views', function(req, res){
            if(req.body.name === undefined){  
                    
                res.setHeader("content-type", "application/json");
                res.status(400).json(error00);
            
              }
          else{
            var node = createNode({
                name: req.body.name,
                parent: {name: "", parent: ""}
            });
           
            node.save(function(error){
                if(error) res.send(error00);
                res.setHeader("content-type", "application/json");
                res.status(201).json(node);
            });
        }});
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
            // Gleiches, wie beim "Löschen" einer Node, da Views == Nodes.
            Node.findOne({"name": req.params.view_id, "parent": "/"}, function(error, node){
                if(error) res.status(404).json(error04);
                else if(node == null) res.status(404).json(error04);
                else {
                    node.visible = false;

                    node.save(function(error){
                        if(error) res.send(error);
                        res.status(200).json(node);
                    });
                }
            });
        });


        /*-------------------------------Nodes--------------------------------------*/
        // sample api route
        app.get('/api/nodes', function(req, res) {
            // use mongoose to get all nerds in the database
            var query = {};
            if(req.query.name) query.name = new RegExp(req.query.name, 'i'); //i->case-insensitive
            if(req.query.view) query.view = new RegExp(req.query.view, 'i');
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
        	if(req.body.name === undefined){	
					
    			res.setHeader("content-type", "application/json");
    			res.status(400).json(error00);
			
            }
            else{
                var node = createNode(req.body);

                node.save(err => {
                    if (err) {
                        console.warn(err);
                        return;
                    }

                    Node.find({"name": req.body.parent.name }).exec((error, element) => {
                        if (element.length === 0 || error) {
                            console.warn(error);
                            return;
                        }
                        element = element[0];
                        if (element.childNodes === undefined) {
                            element.childNodes = [node._id];
                        } else {
                            element.childNodes.push(node._id);
                        }
                        element.save(error => {
                            console.error(error);
                            if (!error) {
                                return;
                            }
                        });
                    });
                });

                res.setHeader("content-type", "application/json");
                res.status(201).json(node);
            }
		});

        function createNode(nodeObject) {
            var node = new Node();
            node.name = nodeObject.name ;
            node.parent = (nodeObject.parent.parent === "/" ? "/" : (node.parent.parent + "/")) + nodeObject.parent.name;
            node.content = nodeObject.content || "";
            node.childNodes = [];
            node.visible = true;
            return node;
        }
        // route to handle finding goes here (app.get)
        app.get('/api/nodes/:node_id',function(req, res){
        	Node.find({"name": req.params.node_id}, function(error, node){
        		if(error) res.status(404).json(error04);
        		else if(node == null) res.status(404).json(error04);
        		else {
        			res.setHeader("content-type", "application/json");
        			res.status(200).json(node);
        		}
        	})
        });

        app.get('/api/nodes/:node_id/childNodes',function(req, res){
            Node.findOne({"name": req.params.node_id}, function(error, node){
                if(error) res.status(404).json(error04);
                else if(node == null) res.status(404).json(error04);
                else {
                    Node.find({"parent": (node.parent === "/" ? "/" : (node.parent + "/")) + node.name}, (error, childNodes) =>{
                        res.setHeader("content-type", "application/json");
                        res.status(200).json(childNodes);
                    });
                }
            });
        });

        // route to handle updating goes here (app.put)
        app.put('/api/nodes/:node_id', function(req, res){
        	Node.findById(req.params.node_id, function(error, node){
        		if(error) res.send(error04);
        		else{
        			if(req.body === undefined) res.status(400).json(error00);
        			else{
                        if(req.body.name !== undefined) node.name = req.body.name;
                        if(req.body.view != undefined) node.view = req.body.view;
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
            Node.findOne({"name": req.params.node_id}, function(error, node){
                if(error) res.status(404).json(error04);
                else if(node == null) res.status(404).json(error04);
                else {
                    node.visible = false;

                    node.save(function(error){
                        if(error) res.send(error);
                        res.status(200).json(node);
                    });
                }
            });
        });

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };

