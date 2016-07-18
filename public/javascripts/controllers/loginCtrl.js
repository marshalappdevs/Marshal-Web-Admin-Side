angular.module('marshalApp')
.controller('loginCtrl', ['$scope', '$http','$mdToast', function($scope, $http, $mdToast){
    $scope.activated = false;
    $scope.doLogin = function() {
        $scope.activated = true;
        $scope.userData = {username: $scope.username, password: $scope.password};

        $http.post('/auth', $scope.userData).then(function(response) {
            alert(response.data.token);
        },
        function(response) {
            $mdToast.show($mdToast.simple().textContent(response.data));
            $scope.activated = false;
        });
    };
}]);

