angular.module('ViewCreationCtrl', []).controller('ViewCreationController', ['$scope', 'ViewFactory', '$location', function($scope, view, $location) {

 $scope.pageSubClass = "page-views-creation";
// callback for ng-click 'createNewUser':
        $scope.createNewView = function (name) {
        	var _view = {name};
        	view.create(_view)
            .then(function (response) {
                $scope.status = 'Inserted View! Refreshing customer list.';
                
            }, function(error) {
                $scope.status = 'Unable to insert customer: ' + error.message;
            });
            
            $location.path('/views');
        }

}]);