angular.module('ViewService', []).factory('ViewFactory', ['$http', function($http) {

    var baseurl = '/api/views';
    var view = {};
        // call to get all nerds
        view.getAll = function() {
            return $http.get(baseurl);
        };

        view.getOne = function(id) {
            return $http.get(baseurl+"/"+  id);
        };


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        view.create = function(viewData) {
            return $http.post(baseurl, viewData);
        };

        view.update = function(id, viewData){
            return $http.put(baseurl +"/"+ id, viewData);
        };

        // call to DELETE a nerd
        view.delete = function(id) {
            return $http.delete(baseurl +"/"+  id);
        };

       return view;    

}]);