angular.module('ViewCtrl', []).controller('ViewController', ['$scope', 'ViewFactory', '$location', function($scope, view, $location) {

    //$scope.tagline = 'Nothing beats a pocket protector!';
    $scope.pageClass = "page-views";
    $scope.status;
    $scope.views;

    $scope.views = getViews();

    function getViews(){
    	view.getAll().then(function (res){
    		allViews = res.data;
            _views = [];            
            for(var i=0; i<allViews.length; i++){
                
                if(allViews[i].visible != false)
                    _views.push(allViews[i]);
            }
            $scope.views = _views;
    	}, function (error){
    		$scope.status ='Unable to load view data:' +error.message; });
    	
    }

    $scope.updateView = function(name) {
    	$location.path('/view-detail/'+name);
    }
     $scope.createView = function () {
        $location.path('/view-creation');
    };

   

    $scope.hideView = function (name) {
        view.delete(name)
        .then(function (response) {
            $scope.status = 'Hided View! Refreshing customer list.';
            for (var i = 0; i < $scope.views.length; i++) {
                var _view = $scope.views[i];
                if (_view.name === name) {
                    $scope.views.splice(i, 1);
                    break;
                }
            }
            
        }, function (error) {
            $scope.status = 'Unable to hide view: ' + error.message;
        });

    };
    $scope.showView = function(name){       
       $location.path('/views/'+ name);
    }



}]);