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

        .when('/nodes', {
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
    $locationProvider.html5Mode(true);

}]);