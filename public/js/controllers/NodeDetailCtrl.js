angular.module('NodeDetailCtrl', []).controller('NodeDetailController', ['$scope','$routeParams', 'NodeFactory', '$location', function($scope, $routeParams, node, $location) {
	$scope.status;
    $scope.nodes;
    $scope.currentNode;
    $scope.childNodes = [];
    $scope.pageSubClass = "page-nodes-detail";

    $scope.nodes = getNodes($routeParams.view_id);
    $scope.currentNode = getNode($routeParams.id);

    function getNodes(viewname){
        node.getAll(viewname).then(function (res){
            $scope.nodes = res.data;
        }, function (error){
            $scope.status ='Unable to load node data:' +error.message; });
        
    }

    

    function getNode(nodename){
    	node.getOne(nodename).then(function(res){
    		$scope.currentNode = res.data;
            //erhalte die namen der kinder
            node.getAll(nodename).then(function(res){
                for(var i=0; i<res.data.length; i++){
                    $scope.childNodes.push(res.data[i].name);
                }
    	    },
        	function(error){
        		$scope.status = $scope.status ='Unable to load node data:' +error.message; 
            });    	
    	
        },
        function(error){
            $scope.status = 'Unable to load view data:' +error.message; 
        });
        
    }

    function splitElements(elements){
        var elementArray = new Array();
        var string = elements+ "";
        elementArray = string.split("|");
        return elementArray;
    }
    
	// callback for ng-click 'updateUser':
    $scope.updateNode = function (name, content, visible, childNodes) {
        console.log("childs:"+ childNodes);
        childNodes = splitElements(childNodes);
        
        var _node, currName;
     

        for (var i=0; i< $scope.nodes.length; i++){
            var currNode = $scope.nodes[i];
            
            if(currNode.name === $routeParams.id){            
                
                _node = currNode;
                currName = currNode.name;
                   
                if(name !== undefined) _node.name = name;
                if(visible !== undefined) _node.visible = visible;
                if(content !== undefined) _node.content = content;
                if(childNodes !== undefined) {
                
                    _node.childNodes.push(childNodes);
                     
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
        
    	
        $location.path('/views/'+$routeParams.view_id);
    };

     $scope.hideNode = function (name) {
        view.delete(name)
        .then(function (response) {
            $scope.status = 'Hided View! Refreshing customer list.';
            
            $location.path('/nodes');
            
        }, function (error) {
            $scope.status = 'Unable to hide view: ' + error.message;
        });

    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/views');
    };

    //$scope.node = node.getOne($routeParams.id);
}]);