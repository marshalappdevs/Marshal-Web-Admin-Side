angular.module('marshalApp')
.controller('passDialogController', ['$scope', '$mdDialog', 'jwtHelper', '$window', function($scope, $mdDialog, jwtHelper, $window){
    $scope.token = $window.localStorage.getItem('loginToken');
    $scope.username = jwtHelper.decodeToken($scope.token).username;

    $scope.doReconnect = function(password) {
        $mdDialog.hide(password);
    }

    $scope.doCancel = function() {
        $mdDialog.cancel();
    }
}]);