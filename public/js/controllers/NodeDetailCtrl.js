angular.module('NodeDetailCtrl', []).controller('NodeDetailController', ['$scope','$routeParams', 'NodeFactory', '$location', function($scope, $routeParams, node, $location) {
	$scope.status;
    $scope.nodes;
    $scope.currentNode;

    $scope.nodes = getNodes();
    $scope.currentNode = getNode();

    function getNodes(){
    	node.getAll().then(function (res){
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
    $scope.updateNode = function (name, views, content, keywords) {
        
        var _node;
    	for (var i=0; i< $scope.nodes.length; i++){
    		var currNode = $scope.nodes[i];
    		
    		if(currNode._id === $routeParams.id){
    			
    			_node = currNode;
    			if(name != undefined) _node.name = name;
    			if(content != undefined) _node.content = content;
                if(keywords != undefined) _node.keywords = keywords;
    			break;
    		}
    	}
    	
    	node.update(_node._id, _node).then(function(res){
    		$scope.status = "Updated Node! Refreshing node list.";

    	}, function(error){
    		$scope.status = 'Unable to update node: ' + error.message;
    	});
    	
        $location.path('/nodes');
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/nodes');
    };

    //$scope.node = node.getOne($routeParams.id);
}]);