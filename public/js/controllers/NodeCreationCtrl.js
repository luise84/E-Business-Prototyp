angular.module('NodeCreationCtrl', []).controller('NodeCreationController', ['$scope', 'NodeFactory', '$location', function($scope, node, $location) {
// callback for ng-click 'createNewUser':
        $scope.createNewNode = function (name, views, content, keywords) {
        	var _node = {name, content, keywords};
        	node.create(_node)
            .then(function (response) {
                $scope.status = 'Inserted Node! Refreshing customer list.';
                //$scope.nodes.push(_node);
            }, function(error) {
                $scope.status = 'Unable to insert customer: ' + error.message;
            });
            
            $location.path('/nodes');
        }

}]);