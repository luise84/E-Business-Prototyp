// grab the node model we just created
var Node = require('./models/node');
var View = require('./models/view');

//REST operations ==============================================================
var error00 = {type: "error", statusCode: 400, message: "Bad Request"};
var error04 = {type: "error", statusCode: 404, message: "Requested resource not found"};
var success = (message) => { return {type: "success", statusCode: 200, message: message} };

    module.exports = function(app) {
    	// server routes ===========================================================
        // handle things like api calls
        // authentication routes
        /*-------------------------------Views--------------------------------------*/
        /*Views sind Nodes mit parent==null und content==null*/
        /* getAll views*/
        app.get('/api/views', function(req, res){
            Node.find({"parent": null}).exec((err, nodes) => {
                if (err) res.send(err);
                
                res.setHeader("content-type", "application/json");
                res.status(200).json(nodes);
            });
        });
        /*create view*/
        app.post('/api/views', function(req, res){
            if(req.body.name === undefined){  
                    
                res.setHeader("content-type", "application/json");
                res.status(400).json(error00);
            
              }
          else{
            var node = createNode({
                name: req.body.name,
                parent: undefined
            });
           
            node.save(function(error){
                if(error) res.send(error00); return;
                res.setHeader("content-type", "application/json");
                res.status(201).json(node);
            });
        }});
        /*wird nicht genutzt*/
        /*app.get('/api/views/:view_id', function(req, res){
            View.findById(req.params.view_id, function(error, view){
                if(error) res.status(404).json(error04);
                else if(view == null) res.status(404).json(error04);
                else {
                    res.setHeader("content-type", "application/json");
                    res.status(200).json(view);
                }
            })
        });*/
        /*wird nicht genutzt*/
       /* app.put('/api/views/:view_id', function(req, res){
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
        });*/
        /* kein Löschen, sondern nur ausblenden*/
        app.delete('/api/views/:view_id', function(req, res){
            // Gleiches, wie beim "Löschen" einer Node, da Views == Nodes.
            Node.findOne({"name": req.params.view_id}, function(error, node){
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
        /*wird nicht genutzt, da man immer nur die knoten einer view haben möchte, nie alle*/
       /* app.get('/api/nodes', function(req, res) {
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
        });*/

        // Knoten anlegen
        app.post('/api/nodes', function(req, res){
        	if(req.body.name === undefined){	
					
    			res.setHeader("content-type", "application/json");
    			res.status(400).json(error00);
			
        }
            else{
                var node;
                Node.findOne({"name": req.body.parent.name }).exec((error, element) => {
                    // Anlegen der Node in den RAM:
                    node = createNode(req.body);
                    node.parent = element._id;

                    if (element.length === 0 || error) {
                        console.warn(error);
                        return;
                    }
                    if (element.childNodes === undefined) {
                        element.childNodes = [node._id];
                    } else {
                        element.childNodes.push(node._id);
                    }
                    // Erst die Node speichern.
                    node.save(err => {
                        if (err) {
                            console.warn(err);
                            return;
                        }
                        // Dann den Parent aktualisieren.
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
            node.parent = nodeObject.parent === undefined ? null : nodeObject.parent._id;
            node.content = nodeObject.content || "";
            node.childNodes = [];
            node.visible = true;
            return node;
        }
        /* nur einen Knoten mit unique Namen ausgeben*/
        app.get('/api/nodes/:node_id',function(req, res){
        	Node.findOne({"name": req.params.node_id}, function(error, node){
        		if(error) res.status(404).json(error04);
        		else if(node == null) res.status(404).json(error04);
        		else {
        			res.setHeader("content-type", "application/json");
        			res.status(200).json(node);
        		}
        	})
        });
        

        /*alle Kindknoten ausgeben*/
        app.get('/api/nodes/:node_id/childNodes',function(req, res){
            Node.findOne({"name": req.params.node_id}, function(error, node){
                if(error) res.status(404).json(error04);
                else if(node == null) res.status(404).json(error04);
                else {
                    Node.find({"parent": node._id}, (error, childNodes) =>{
                        res.setHeader("content-type", "application/json");
                        res.status(200).json(childNodes);
                    });
                }
            });
        });

        // route to handle updating goes here (app.put)
        app.put('/api/nodes/:node_id', function(req, res){
            
            
            Node.findOne({"name":req.params.node_id}, function(error, node){
        		if(error) res.send(error04);
        		else{
        			if(req.body === undefined) res.status(400).json(error00);
        			else {
                        
                        if(req.body.name !== undefined) node.name = req.body.name;
                        if(req.body.visible !== undefined) node.visible = req.body.visible;
                        if(req.body.content !== undefined) node.content = req.body.content;
                        //suche Nodes, die zukünftige Kinder sein sollen
                       
                        Node.find({"name": { "$in": req.body.childNodes }}, (error, subNodes) => {
                            console.log("subnodes:"+ subNodes);
                            if (!error) {
                                // Nodes wurden erfolgreich gefunden.
                                var initialChildNodes = node.childNodes;//bisherige Kinder

                                node.childNodes = subNodes; //neue Kinder
                                
                                // Speichere den geänderten Hauptknoten.
                                saveNode(node, res, () => {}, 
                                    () => {
                                    for (i in initialChildNodes) {
                                        // Bei den alten Kindknoten die Referenz auf den Parent löschen.
                                        Node.findOne({"_id": initialChildNodes[i]}, (error, childNode) => {
                                            if (error) return error;
                                            
                                            
                                            if (childNode.parent.length === 0) childNode.parent = null;
                                            childNode.parent.splice(childNode.parent.indexOf(node._id), 1);
                                            saveNode(childNode, undefined);
                                        });
                                    }

                                    for (i in subNodes) {
                                        // Für jeden neuen Kindknoten update auch ihre Referenz auf den Parent.
                                        
                                        if (subNodes[i].parent) {
                                            
                                            if (subNodes[i].parent.indexOf(node._id) == -1) {                                                
                                                subNodes[i].parent.push(node);                                                
                                            }
                                        } else {                                            
                                            subNodes[i].parent = [];
                                            subNodes[i].parent.push(node);                                            
                                        }
                                        saveNode(subNodes[i], undefined);
                                    }

                                });
                            }
                            else{ console.log(error);}
                        }); 
                        

                                            
                    }
        		}
        	});
        });

        function saveNode(node, res, errCallback, sucCallback) {
            node.save(error => {
                if (error && errCallback) {
                    errCallback();
                }
                if (error && res) {
                    // Wenn es einen Fehler gab, und dieser in der Antwort enthalten sein soll.
                    res.json(error);
                } else if (res) {
                    // Es gab keinen Fehler und die Antwort soll an den Client weitergegeben werden.
                    res.setHeader("content-type", "application/json");
                    res.status(200).json(node);
                } 
                if (!error && sucCallback) {
                    sucCallback()
                }
            });
        }

        // route to handle delete goes here (app.delete)
        /*no deleting only setting invisible*/
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



        /*function splitElements(str){
            var elementArray = new Array();
            var string = str+ "";
            elementArray = string.split("|");
            return elementArray;
        }*/

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };

