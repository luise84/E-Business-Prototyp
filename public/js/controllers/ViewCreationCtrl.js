angular.module('ViewCreationCtrl', []).controller('ViewCreationController', ['$scope', 'ViewFactory', '$location', function($scope, view, $location) {
// callback for ng-click 'createNewUser':
        $scope.createNewView = function (name, nodes) {
        	var _view = {name, nodes};
        	view.create(_view)
            .then(function (response) {
                $scope.status = 'Inserted View! Refreshing customer list.';
                //$scope.views.push(_view);
            }, function(error) {
                $scope.status = 'Unable to insert customer: ' + error.message;
            });
            
            $location.path('/views');
        }

}]);