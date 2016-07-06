var app = angular.module
(
    'marshalApp',
    [
        'ngRoute'
    ]
);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            template: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        })
        .when('/courses', {
            templateUrl : './templates/home.html'
        })
        .when('/malshabs', {
            templateUrl: './templates/malshabs.html'
        })
        .when('/push', {
            templateUrl: './templates/push.html'
        })
        .when('/materials', {
            templateUrl: './templates/materials.html'
        })
        .when('/meetups', {
            templateUrl: './templates/meetups.html'
        });
});