angular.module('ViewCtrl', []).controller('ViewController', ['$scope', 'ViewFactory', '$location', function($scope, view, $location) {

    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-views";
    $scope.status;
    $scope.views;

    getViews();

    function getViews(){
    	view.getAll().then(function (res){
    		$scope.views = res.data;
    	}, function (error){
    		$scope.status ='Unable to load view data:' +error.message; });
    	
    }

    $scope.updateView = function(id) {
    	var _view;
    	for (var i=0; i< $scope.views.length; i++){
    		var currView = $scope.views[i];
    		if(currView.id === id){
    			_view = currView;
    			break;
    		}
    	}
    	view.update(_view).then(function(res){
    		$scope.status = "Updated View! Refreshing view list.";

    	}, function(error){
    		$scope.status = 'Unable to update view: ' + error.message;
    	});
    	$location.path('/view-detail/'+id);
    }
     $scope.createView = function (viewData) {
        //Fake view data
        var _view = viewData;
        view.create(_view)
            .then(function (response) {
                $scope.status = 'Inserted View! Refreshing customer list.';
                $scope.views.push(_view);
            }, function(error) {
                $scope.status = 'Unable to insert customer: ' + error.message;
            });
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



}]);