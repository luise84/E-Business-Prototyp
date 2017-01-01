// create the controller and inject Angular's $scope
angular.module('MainCtrl', []).controller('MainController', function($scope) {
	// create a message to display in our view
    //$scope.tagline = 'To the moon and back!';  
    $scope.pageClass = "page-home"; 

});