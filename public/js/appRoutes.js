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
        .when('/view-detail', {
            templateUrl: 'views/view-detail.html',
            controller: 'ViewController'
        })
        .when('/view-creation', {
            templateUrl: 'views/view-creation.html',
            controller: 'ViewController'
        })

    $locationProvider.html5Mode(true);

}]);