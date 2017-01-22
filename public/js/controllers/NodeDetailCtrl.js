angular.module('NodeDetailCtrl', []).controller('NodeDetailController', ['$scope','$routeParams', 'NodeFactory', '$location', function($scope, $routeParams, node, $location) {
	$scope.status;
    $scope.nodes;
    $scope.currentNode;

    $scope.nodes = getNodes($routeParams.id);
    $scope.currentNode = getNode();

    function getNodes(name){
        node.getAll(name).then(function (res){
            $scope.nodes = res.data;
        }, function (error){
            $scope.status ='Unable to load node data:' +error.message; });
        
    }

    

    function getNode(){
    	node.getOne($routeParams.id).then(function(res){
    		$scope.currentNode = res.data;
    	},
    	function(error){
    		$scope.status = $scope.status ='Unable to load node data:' +error.message; });
    	
    	
    }
    
	// callback for ng-click 'updateUser':
    $scope.updateNode = function (name, content, visible, childNodes) {
        
        var _node, currName;
        for (var i=0; i< $scope.nodes.length; i++){
            var currNode = $scope.nodes[i];
            
            if(currNode.name === $routeParams.id){            
                
                _node = currNode;
                currName = currNode.name;
                            
                if(name !== undefined) _node.name = name;
                if(visible !== undefined) _node.visible = visible;
                if(content !== undefined) _node.content = content;
                if(childNodes !== undefined) 
                children = childNodes.split(' | ');
                    _node.childNodes.push(children);
                     console.log(_node)   ;
                break;
            }
        }

        node.update(currName, _node).then(function(res){
            $scope.status = "Updated View! Refreshing view list.";

        }, function(error){
            $scope.status = 'Unable to update node: ' + error.message;
        });
        //@TODO getall childnodes for elem.
        
    	
        $location.path('/nodes');
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/nodes');
    };

    //$scope.node = node.getOne($routeParams.id);
}]);