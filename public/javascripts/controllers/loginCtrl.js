angular.module('marshalApp')
.controller('loginCtrl', ['$scope', function($scope){
    $scope.activated = false;
    $scope.doLogin = function() {
        $scope.activated = true;
    };
}]);

