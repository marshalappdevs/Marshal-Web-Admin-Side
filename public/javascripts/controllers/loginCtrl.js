angular.module('marshalApp')
.controller('loginCtrl', ['$scope', '$http','$mdToast','$window', '$location',function($scope, $http, $mdToast, $window, $location){
    $scope.activated = false;

    // Login mehod
    $scope.doLogin = function() {
        // Disable inputs and start loading symbol
        $scope.activated = true;
        $scope.userData = {username: $scope.username, password: $scope.password, isLogin: true};

        // Get api and login tokens, and redirect if correct, display message otherwise
        $http.post('/auth', $scope.userData).then(function(response) {
           $window.localStorage.setItem('apiToken', response.data.apiToken);
           $window.localStorage.setItem('loginToken', response.data.loginToken);
           $window.location.href = '/?token='+response.data.loginToken;
        },
        function(response) {
            $mdToast.show($mdToast.simple().textContent(response.data));
            $scope.activated = false;
        });
    };

    if($location.search().msg == 'np') {
        $mdToast.show($mdToast.simple().textContent("אין לך הרשאות להתחבר, התחבר עם משתמש בעל הרשאות נרחבות יותר"));
    }
}]);

