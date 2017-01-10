angular.module('ViewCtrl', []).controller('ViewController', ['$scope', 'ViewFactory', '$location', function($scope, view, $location) {

    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-views";
    $scope.status;
    $scope.views;

    $scope.views = getViews();

    function getViews(){
    	view.getAll().then(function (res){
    		$scope.views = res.data;
    	}, function (error){
    		$scope.status ='Unable to load view data:' +error.message; });
    	
    }

    $scope.updateView = function(id) {
    	$location.path('/view-detail/'+id);
    }
     $scope.createView = function () {
        $location.path('/view-creation');
    };

    $scope.deleteView = function (id) {
        view.delete(id)
        .then(function (response) {
            $scope.status = 'Deleted View! Refreshing customer list.';
            for (var i = 0; i < $scope.views.length; i++) {
                var _view = $scope.views[i];
                if (_view.id === id) {
                    $scope.views.splice(i, 1);
                    break;
                }
            }
            
        }, function (error) {
            $scope.status = 'Unable to delete view: ' + error.message;
        });

    };
    $scope.showView = function(id){
       // $location.path('/nodes');
       //$location.path('/view-node');
       $location.path('/views/'+ id);
    }



}]);