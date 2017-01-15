angular.module('NodeCreationCtrl', []).controller('NodeCreationController', ['$scope', 'NodeFactory', '$location', '$routeParams', function($scope, node, $location, $routeParams) {
// callback for ng-click 'createNewUser':
    $scope.parent.name = $routeParams.id;


    $scope.createNewNode = function (name, content, childNodes) {
    	var _node = {
            name,
            content,
            childNodes,
            visible: true, 
            parent: { 
                name: $scope.parent.name 
            }
        };
    	console.log(_node);
        node.create(_node)
        .then(function (response) {
            $scope.status = 'Inserted Node! Refreshing customer list.';
            //$scope.nodes.push(_node);
        }, function(error) {
            $scope.status = 'Unable to insert customer: ' + error.message;
        });
        
        $location.path('/views/'+$scope.parent.name);
    }

}]);