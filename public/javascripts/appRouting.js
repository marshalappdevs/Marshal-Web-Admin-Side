angular.module('marshalApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'index'
            })
            .when('/courseDialog', {
                templateUrl : 'courseDialog'
            });
    });