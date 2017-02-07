angular.module('NodeCtrl', []).controller('NodeController', ['$scope', 'NodeFactory', '$location','$routeParams', 'VisDataSet','$compile', '$window', 
    function($scope, node, $location, $routeParams, VisDataSet, $compile, $window){
    //var cheerio = require('cheerio');
    //var request = require('request');
    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-nodes";
    $scope.status;
    $scope.nodes;
    $scope.view = $routeParams.id;
    $scope.content = "";
    $scope.nodetemplate = "";
    $scope.activeNode;
    

    

    getNodes($scope.view);
    
    
    function getNodes(viewName){
        if (!viewName) {
            // Ignoriere das initiale Ausführen des Controllers.
            return;
        }
        
    	node.getAll(viewName).then(function (res){
            allNodes = res.data;
            _nodes = [];
            for(var i=0; i<allNodes.length; i++){
                if(allNodes[i].visible != false)
                    _nodes.push(allNodes[i]);
            }

    		$scope.nodes = _nodes;
            
            renderVisualisation($scope.nodes);
            //initialMethods();

    	}, function (error){
    		$scope.status ='Unable to load node data:' +error.message; });
    	
    }
    function getChildrenNames(nodename){
        var children= [];
        

        node.getOne(nodename).then(function(res){
            
            //erhalte die namen der kinder
            node.getAll(nodename).then(function(res){
                for(var i=0; i<res.data.length; i++){
                    children.push(res.data[i].name);
                }
            },
            function(error){
                $scope.status = $scope.status ='Unable to load node data:' +error.message; 
            });     
        
        },
        function(error){
            $scope.status = 'Unable to load view data:' +error.message; 
        });
        return children;
        
    }




    $scope.updateNode = function(name, content, url, visible) {        
            $scope.nodetemplate = "node-update";

            var children =  getChildrenNames(name);
            
            $scope.updnode = name;
            $scope.updcontent =  content;
            $scope.updurl = url;
            $scope.updchildnodes = children;
            $scope.updvisible = visible;

       
    	//$location.path('/views/'+$scope.view+'/node-detail/'+name);
    }
     $scope.createNode = function () {        
            $scope.nodetemplate = "node-creation";
            
        
        //$location.path('/views/'+$scope.view+'/node-creation');
    };


    
    

    $scope.hideNode = function (name) {

        node.delete(name)
        .then(function (response) {
            $scope.status = 'Deleted Node! Refreshing customer list.';
            for (var i = 0; i < $scope.nodes.length; i++) {
                var _node = $scope.nodes[i];
                if (_node.name === name) {
                    $scope.nodes.splice(i, 1);
                    break;
                }
            }
            
        }, function (error) {
            $scope.status = 'Unable to delete node: ' + error.message;
        });

    };


    //-------------------------------VisJS---------------------------------------
    
   
     

    $scope.onClick = function(props) { 
        var result;       
        var node_ = props.nodes[0];        
        for(n in $scope.nodes){            
            if($scope.nodes[n]._id === node_){
                //update scope-variable
                $scope.$apply(function(){
                    result = $scope.nodes[n];

                     
                });
                break;
                 
                 
            }

        }
        $scope.activeNode = result.url;
        //if(result.url) openLink(result.url);
        $scope.updateNode(result.name, result.content, result.url, result.visible);
        
        
        
    };
   
    //verbunden mit click-event
    $scope.doubleClick = function(){
        if($scope.activeNode){
            $window.open($scope.activeNode);
        }
    }
    

    $scope.rightClick = function(props) {
      
      console.log('rightClick');
      //props.event.preventDefault();
    };
    
    $scope.options = {
      autoResize: true,
      height: '800',
      width: '100%',
      manipulation: {
        enabled: false
        
      },
      layout: {
        hierarchical: false
        }

    };
    
    //controller events-service(directive)-events binding
    $scope.events = {
        rangechange: $scope.onRangeChange,
        rangechanged: $scope.onRangeChanged,
        onload: $scope.onLoaded,
        click: $scope.onClick,
        doubleClick: $scope.dbclick,
        contextmenu: $scope.rightClick
    };


    
    
    function renderVisualisation(data){
        var jsonNodesStringStart = '{"nodes": [';
        var jsonNodesMiddle = "";
        var jsonNodesStringEnd = '],';

        var jsonEdgesStart = '"edges":[';
        var edges="";
        var jsonEdgesEnd = ']}';
        
        for (i in data){   
            if(data[i].childNodes.length == 0){
                var shape = '"shape": "square",';
                var size = '"size": 7,';
                var color = '"color": "#337ab7",';
                 var font = '"font": {"color": "black"},';
            }
            else {
                var shape = '"shape": "circle",';
                var size = '"size": 5,';
                var color = '"color": "#2e6da4",';
                var font = '"font": {"color": "white"},';
                for(j in data[i].childNodes) {
                    
                     edges += '{"from": "'+data[i]._id+'",'+
                    '"to": "'+data[i].childNodes[j]+ genEdgeLabel(data[i]._id,data[i].childNodes[j])+'},'                    
                }
            }
            if(data[i].visible){
                jsonNodesMiddle += '{ "id": "' + data[i]._id + '",'+
                ' "label": "'+data[i].name+'",'+
                size+color+shape+font+'"shadow":true},';
            }
        }
        
        var result = jsonNodesStringStart+jsonNodesMiddle+jsonNodesStringEnd+jsonEdgesStart+edges+jsonEdgesEnd;
        result = result.replace(new RegExp(",]"),"]"); // lösche letztes ,
        result = result.replace(new RegExp("},]"),"}]");
        $scope.data = JSON.parse(result);





    }

    function genEdgeLabel(parentId, childId){
        var label = "";
        var stNode = "";
        var ndNode ="";
        
        for(n in $scope.nodes){            
                if($scope.nodes[n]._id === parentId)
                    stNode = $scope.nodes[n].name;
                if($scope.nodes[n]._id === childId)
                    ndNode = $scope.nodes[n].name;
                     
                if(stNode && ndNode) {
                   
                    var shortStr =  "";
                    var longStr = "";
                    if(stNode.length>= ndNode.length){
                        longStr = stNode;
                        shortStr = ndNode;
                    }
                    else{
                        shortStr = stNode;
                        longStr = ndNode;
                    }            
                    label = longStr.indexOf(shortStr) != -1 ? shortStr : "";
                    label = '","label":'+'"'+label+'"'+
                    ',"font": {"align": "middle"}';
                    return label;
                }
        }

        

    }

   $scope.generateNodes = function(){
        var url = "https://de.wikipedia.org/wiki/"+ $scope.view;
        node.webscraping({"url": url});
        
        
}

    




}])
.directive('nodeTemplate', ['NodeFactory', function(node){
    return {
        
        template: '<ng-include src="getTemplateURL()"/>',
        restrict: "AEC",
        scope: {
            name: "@", //passed by value (string)
            view: '@', 
            modelValue: '=ngModel', //passed as reference
            node: '@',
            url: '@',
            content: '@',
            childnodes: '@',
            visible: '@'
        },
        
        transclude: true,

        controller: function($scope){
            $scope.getTemplateURL = function(){
                
                if($scope.name == "node-creation")
                    return "views/node-creation.html";
                if($scope.name == "node-update"){
                    
                            
                    return "views/node-detail.html";
                }
            };
           
            
            

        },
        
        link: function($scope, element, attrs){

           
           
            $scope.createNewNode = function (name, content, url, childNodes) {
                var _node = {
                    name,
                    content,
                    url,
                    childNodes,
                    visible: true, 
                    parent: { 
                        name: $scope.view 
                    }
                };
                console.log(_node);
                node.create(_node)
                .then(function (response) {
                    $scope.status = 'Inserted Node! Refreshing customer list.';
                    //$scope.nodes.push(_node);
                }, function(error) {
                    console.log(error);
                    $scope.status = 'Unable to insert customer: ' + error.message;
                });
                
               
            };
            node.getAll($scope.view).then(function (res){
                        $scope.nodes = res.data;
                        
                        return;
                    }, function (error){});

            $scope.updateNode = function (name, content, url,visible, childNodes) {
                           

                var _node, currName;
             
                for (var i=0; i< $scope.nodes.length; i++){
                    var currNode = $scope.nodes[i];
                    
                    if(currNode.name === $scope.node){            
                        
                        _node = currNode;
                        currName = currNode.name;
                           
                        if(name !== undefined) _node.name = name;
                        if(url !== undefined) _node.url = url;
                        if(visible !== undefined) _node.visible = visible;
                        if(content !== undefined) _node.content = content;
                        if(childNodes !== undefined) {
                            console.log("neue Kinder:" + childNodes);
                            childNodes = childNodes.split("|");
                            _node.childNodes = [];
                            for(c in childNodes)  _node.childNodes.push(childNodes[c].trim());
                            
                           
                             
                         }
                         
                        break;
                    }
                }
                console.log("neue Kinder: "+ _node.childNodes);
                node.update(currName, _node).then(function(res){
                    $scope.status = "Updated View! Refreshing view list.";

                }, function(error){
                    $scope.status = 'Unable to update node: ' + error.message;
                });
                //@TODO getall childnodes for elem.
                
                
               // $location.path('/views/'+$routeParams.view_id);
            };
            $scope.hideNode = function () {
                node.delete($scope.node)
                .then(function (response) {
                    $scope.status = 'Hided View! Refreshing customer list.';
                    
                    //$location.path('/nodes');
                    
                }, function (error) {
                    $scope.status = 'Unable to hide view: ' + error.message;
                });

            };


        }
        
    }
}]);
