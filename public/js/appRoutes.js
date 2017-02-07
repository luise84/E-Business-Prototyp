angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        
        .when('/views', {
            templateUrl: 'views/view.html',
            controller: 'ViewController'
        })
        .when('/views/:id', {
            templateUrl: 'views/node.html',
            controller: 'NodeController'
        })       
        
        .when('/view-creation', {
            templateUrl: 'views/view-creation.html',
            controller: 'ViewCreationController'
        })
        .when('/view-detail/:id', {
            templateUrl: 'views/view-detail.html',
            controller: 'ViewDetailController'
        })
        .otherwise({redirectTo: '/views'});

    $routeProvider

        /* .when('/nodes', {
            templateUrl: 'views/node.html',
            controller: 'NodeController'
        })*/
         .when('/views/:id/node-creation', {
            templateUrl: 'views/node-creation.html',
            controller: 'NodeCreationController'
         })
         .when('/views/:view_id/node-detail/:id', {
            templateUrl: 'views/node-detail.html',
            controller: 'NodeDetailController'
         })
         
         

        .otherwise({redirectTo: '/views'});
    $locationProvider.html5Mode(true);

}]);