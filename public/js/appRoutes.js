angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // nodes page that will use the NerdController
        .when('/views', {
            templateUrl: 'views/view.html',
            controller: 'ViewController'
        })
        .when('/views/:id', {
            templateUrl: 'views/view-node.html',
            controller: 'NodeMainController'
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

         .when('/nodes', {
            templateUrl: 'views/node.html',
            controller: 'NodeController'
        })
         .when('/node-creation', {
            templateUrl: 'views/node-creation.html',
            controller: 'NodeCreationController'
         })
         .when('/node-detail/:id', {
            templateUrl: 'views/node-detail.html',
            controller: 'NodeDetailController'
         })
         .when('/view-node', {
            templateUrl: 'views/view-node.html',
            controller: 'VisController'
         })

        .otherwise({redirectTo: '/nodes'});
    $locationProvider.html5Mode(true);

}]);