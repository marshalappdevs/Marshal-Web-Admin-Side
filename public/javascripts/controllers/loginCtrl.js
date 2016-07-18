angular.module('marshalApp')
.controller('loginCtrl', ['$scope', '$http','$mdToast','$window', function($scope, $http, $mdToast, $window){
    $scope.activated = false;
    $scope.doLogin = function() {
        $scope.activated = true;
        $scope.userData = {username: $scope.username, password: $scope.password, isLogin: true};

        $http.post('/auth', $scope.userData).then(function(response) {
           $window.localStorage.setItem('apiToken', response.data.apiToken);
           $window.location.href = '/?token='+response.data.loginToken;
        },
        function(response) {
            $mdToast.show($mdToast.simple().textContent(response.data));
            $scope.activated = false;
        });
    };
}]);

