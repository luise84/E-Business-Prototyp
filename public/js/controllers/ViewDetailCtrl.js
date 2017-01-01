angular.module('ViewDetailCtrl', []).controller('ViewDetailController', ['$scope','$routeParams', 'ViewFactory', '$location', function($scope, $routeParams, view, $location) {
	$scope.status;
    $scope.views;
    $scope.currentView;

    $scope.views = getViews();
    $scope.currentView = getView();

    function getViews(){
    	view.getAll().then(function (res){
    		$scope.views = res.data;
    	}, function (error){
    		$scope.status ='Unable to load view data:' +error.message; });
    	
    }

    function getView(){
    	view.getOne($routeParams.id).then(function(res){
    		$scope.currentView = res.data;
    	},
    	function(error){
    		$scope.status = $scope.status ='Unable to load view data:' +error.message; });
    	
    	
    }
    
	// callback for ng-click 'updateUser':
    $scope.updateView = function (name, nodes) {
        
        var _view;
    	for (var i=0; i< $scope.views.length; i++){
    		var currView = $scope.views[i];
    		
    		if(currView._id === $routeParams.id){
    			
    			_view = currView;
    			if(name != undefined) _view.name = name;
    			if(nodes != undefined) _view.nodes = nodes;
    			break;
    		}
    	}
    	
    	view.update(_view._id, _view).then(function(res){
    		$scope.status = "Updated View! Refreshing view list.";

    	}, function(error){
    		$scope.status = 'Unable to update view: ' + error.message;
    	});
    	
        $location.path('/views');
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/views');
    };

    //$scope.view = view.getOne($routeParams.id);
}]);