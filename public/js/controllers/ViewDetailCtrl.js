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
    $scope.updateView = function (name, content, visible, childNodes) {
        
        var _view, currName;
    	for (var i=0; i< $scope.views.length; i++){
    		var currView = $scope.views[i];
    		
    		if(currView.name === $routeParams.id){            
    			
    			_view = currView;
                currName = currView.name;
                   			
                if(name !== undefined) _view.name = name;
                if(visible !== undefined) _view.visible = visible;
                if(content !== undefined) _view.content = content;
                if(childNodes !== undefined) _view.childNodes.push(childNodes);
                     console.log(_view)   ;
    			break;
    		}
    	}

    	view.update(currName, _view).then(function(res){
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