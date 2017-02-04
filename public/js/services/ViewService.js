

angular.module('ViewService', []).factory('ViewFactory', ['$http', function($http) {

    var baseurl = '/api/views';
    var view = {};
        // call to get all nerds
        view.getAll = function() {
            return $http.get(baseurl);
        };

        view.getOne = function(name) {
            return $http.get("/api/nodes"+"/"+  name);
        };


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        view.create = function(viewData) {
            console.log(viewData);
            return $http.post(baseurl, viewData);
        };

        view.update = function(name, viewData){
            return $http.put("/api/nodes" +"/"+ name, viewData);
        };

        // call to DELETE a nerd
        view.delete = function(name) {
            return $http.delete(baseurl +"/"+  name);
        };

       return view;    

}]);