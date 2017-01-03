angular.module('marshalApp')
.controller('loginCtrl', ['$scope', '$http','$mdToast','$window', '$location', 'bsLoadingOverlayService', 'jwtHelper', function($scope, $http, $mdToast, $window, $location, bsLoadingOverlayService, jwtHelper){
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

    try {
        // Auto login
        var token = $window.localStorage.getItem('loginToken');
        if(token && !(jwtHelper.isTokenExpired(token))) {
            // Eye candy
            $scope.activated = true;
            $scope.username = jwtHelper.decodeToken(token).username;
            $scope.password = 'thisisnotthepassword'

            // Actual redirection
            $window.location.href = '/?token='+$window.localStorage.getItem('loginToken');
        } else if($location.search().msg == 'np') {
        $mdToast.show($mdToast.simple().textContent("אין לך הרשאות להתחבר, התחבר עם משתמש בעל הרשאות נרחבות יותר"));
        }
    } 
    catch(err) {
        // If someone tampered with his login token, then remove it
        $window.localStorage.removeItem('loginToken');
        $window.localStorage.removeItem('apiToken');
        $window.location.reload(false);
    }
}]);

