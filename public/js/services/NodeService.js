angular.module('NodeService', []).factory('NodeFactory', ['$http', function($http) {

    var baseurl = '/api/nodes';
    var node =  {};
   
        // call to get all nerds
        node.getAll = function(name) {
            return $http.get(baseurl+"/"+name+"/childNodes");
        };
        node.getOne = function(name) {
            return $http.get(baseurl+"/"+ name);
        };

        node.getWithID = function(id){
            return $http.get(baseurl+"/"+id);
        }


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        node.create = function(nodeData) {
            return $http.post(baseurl, nodeData);
        };

        node.update = function(id){
            return $http.put(baseurl +"/"+ id);
        };

        // call to DELETE a nerd
        node.delete = function(id) {
            return $http.delete(baseurl +"/"+ id);
        };
        return node;

}]);