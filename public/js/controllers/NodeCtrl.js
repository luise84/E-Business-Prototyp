angular.module('NodeCtrl', []).controller('NodeController', ['$scope', 'NodeFactory', '$location', function($scope, node, $location) {

    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-nodes";
    $scope.status;
    $scope.nodes;

    $scope.nodes = getNodes();

    function getNodes(){
    	node.getAll().then(function (res){
    		$scope.nodes = res.data;
    	}, function (error){
    		$scope.status ='Unable to load node data:' +error.message; });
    	
    }

    $scope.updateNode = function(id) {
    	$location.path('/node-detail/'+id);
    }
     $scope.createNode = function () {
        $location.path('/node-creation');
    };

    $scope.deleteNode = function (id) {

        node.delete(id)
        .then(function (response) {
            $scope.status = 'Deleted Node! Refreshing customer list.';
            for (var i = 0; i < $scope.nodes.length; i++) {
                var _node = $scope.nodes[i];
                if (_node.id === id) {
                    $scope.nodes.splice(i, 1);
                    break;
                }
            }
            
        }, function (error) {
            $scope.status = 'Unable to delete node: ' + error.message;
        });

    };
    $scope.showNode = function(id){
        $location.path('/node-detail/'+id);

    }



}]);