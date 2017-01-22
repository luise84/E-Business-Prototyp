angular.module('NodeCtrl', []).controller('NodeController', ['$scope', 'NodeFactory', '$location','$routeParams', function($scope, node, $location, $routeParams) {

    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-nodes";
    $scope.status;
    $scope.nodes;
    $scope.view = $routeParams.id;

    $scope.nodes = getNodes($scope.view);
    
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

    	}, function (error){
    		$scope.status ='Unable to load node data:' +error.message; });
    	
    }

    $scope.updateNode = function(name) {
        console.log("drin");
    	$location.path('/views/'+$scope.view+'/node-detail/'+name);
    }
     $scope.createNode = function () {
        $location.path('/views/'+$scope.view+'/node-creation');
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
    



}]);