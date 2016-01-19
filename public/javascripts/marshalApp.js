// var tempJson = [
//     {
//         name: "Cyber Warfare",
//         desc: "Cyber Cyber Cyber Cyber Cyber Cyber Cyber Cyber Cyber",
//         price: 200
//     },
//     {
//         name: "Anatomy of Attack",
//         desc: "Zolantz Zolantz Zolantz Zolantz Zolantz Zolantz Zolantz",
//         price: 500
//     },
//     {
//         name: "Secure Java",
//         desc: "DorP DorP DorP DorP DorP DorP DorP DorP DorP DorP DorP",
//         price: 300
//     }
// ]

var marshalApp = angular.module('marshalApp', ['ngRoute']);

// marshalApp.controller('coursesCtrl', function($scope) {
//    $scope.courses = tempJson; 
// });

marshalApp.controller('loginController', function($scope) {
    console.log("A");
});

marshalApp.config(function($routeProvider) {
   $routeProvider
        .when('/', {
            templateUrl : 'login'
        });
});