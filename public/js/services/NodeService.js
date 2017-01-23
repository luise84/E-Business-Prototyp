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

       


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        node.create = function(nodeData) {
            return $http.post(baseurl, nodeData);
        };

        node.update = function(id, nodeData){
            return $http.put(baseurl +"/"+ id, nodeData);
        };

        // call to DELETE a nerd
        node.delete = function(id) {
            return $http.delete(baseurl +"/"+ id);
        };
        return node;

}])


//-----------------------------VisJS------------------------------------
.factory('VisDataSet', function () {
        'use strict';
        return function (data, options) {
            // Create the new dataSets
            return new vis.DataSet(data, options);
        };
    })/**
 * Directive for network chart.
 */
    .directive('visNetwork', function () {
        return {
            restrict: 'EA',
            transclude: false,
            scope: {
                data: '=',
                options: '=',
                events: '='
            },
            link: function (scope, element, attr) {
                var networkEvents = [
                    'click',
                    'doubleclick',
                    'oncontext',
                    'hold',
                    'release',
                    'selectNode',
                    'selectEdge',
                    'deselectNode',
                    'deselectEdge',
                    'dragStart',
                    'dragging',
                    'dragEnd',
                    'hoverNode',
                    'blurNode',
                    'zoom',
                    'showPopup',
                    'hidePopup',
                    'startStabilizing',
                    'stabilizationProgress',
                    'stabilizationIterationsDone',
                    'stabilized',
                    'resize',
                    'initRedraw',
                    'beforeDrawing',
                    'afterDrawing',
                    'animationFinished'

                ];

                var network = null;

                scope.$watch('data', function () {
                    // Sanity check
                    if (scope.data == null) {
                        return;
                    }

                    // If we've actually changed the data set, then recreate the graph
                    // We can always update the data by adding more data to the existing data set
                    if (network != null) {
                        network.destroy();
                    }

                    // Create the graph2d object
                    network = new vis.Network(element[0], scope.data, scope.options);

                    // Attach an event handler if defined
                    angular.forEach(scope.events, function (callback, event) {
                        if (networkEvents.indexOf(String(event)) >= 0) {
                            network.on(event, callback);
                        }
                    });

                    // onLoad callback
                    if (scope.events != null && scope.events.onload != null &&
                        angular.isFunction(scope.events.onload)) {
                        scope.events.onload(graph);
                    }
                });

                scope.$watchCollection('options', function (options) {
                    if (network == null) {
                        return;
                    }
                    network.setOptions(options);
                });
            }
        };
    });