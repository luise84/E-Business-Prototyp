angular.module('NodeService', []).factory('Node', ['$http', function($http) {

    var baseurl = '/api/nodes';
    var node =  {};
   
        // call to get all nerds
        node.getAll = function() {
            return $http.get(baseurl);
        };
        node.getOne = function(id) {
            return $http.get(baseurl+  id);
        };


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        node.create = function(nodeData) {
            return $http.post(baseurl, nodeData);
        };

        node.update = function(id){
            return $http.put(baseurl + id);
        };

        // call to DELETE a nerd
        node.delete = function(id) {
            return $http.delete(baseurl + id);
        };
        return node;

}]);