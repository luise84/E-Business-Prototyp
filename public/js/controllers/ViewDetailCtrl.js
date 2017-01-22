angular.module('ViewDetailCtrl', []).controller('ViewDetailController', ['$scope','$routeParams', 'ViewFactory', 'NodeFactory', '$location', function($scope, $routeParams, view, node, $location) {
	$scope.status;
    $scope.views;
    $scope.currentView;

    //$scope.views = getViews();
    $scope.currentView = getView();
    $scope.childNodes = [];



    function getViews(){
    	view.getAll().then(function (res){
    		$scope.views = res.data;
            
    	}, function (error){
    		$scope.status ='Unable to load view data:' +error.message; });
    	
    }

    function getView(){
    	view.getOne($routeParams.id).then(function(res){
    		$scope.currentView = res.data;
           //erhalte die namen der kinder
            node.getAll($routeParams.id).then(function(res){
                for(var i=0; i<res.data.length; i++){
                    $scope.childNodes.push(res.data[i].name);
                }
            }, function(error){
                $scope.status = 'Unable to load view data:' +error.message;
            });
    	},


    	function(error){
    		$scope.status = 'Unable to load view data:' +error.message; });
    	
    	
    }
    
	// callback for ng-click 'updateUser':
    $scope.updateView = function (name, content, visible, childNodes) {
        console.log("childs:"+ childNodes);
        
        var _view, currName;
    	for (var i=0; i< $scope.views.length; i++){
    		var currView = $scope.views[i];
    		
    		if(currView.name === $routeParams.id){            
    			
    			_view = currView;
                currName = currView.name;
                   			
                if(name !== undefined) _view.name = name;
                if(visible !== undefined) _view.visible = visible;
                if(content !== undefined) _view.content = content;
                if(childNodes !== undefined) 
                    children = childNodes.split(' | ');
                    _view.childNodes.push(children);
                     console.log(_view)   ;
    			break;
    		}
    	}

    	view.update(currName, _view).then(function(res){
    		$scope.status = "Updated View! Refreshing view list.";

    	}, function(error){
    		$scope.status = 'Unable to update view: ' + error.message;
    	});
    	//@TODO getall childnodes for elem.
        $location.path('/views');
    };

    // callback for ng-click 'cancel':
    $scope.cancel = function () {
        $location.path('/views');
    };

    //$scope.view = view.getOne($routeParams.id);
}]);