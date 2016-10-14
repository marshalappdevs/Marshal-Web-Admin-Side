angular.module('marshalApp')
.controller('pushCtrl', ['$scope', function($scope){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "שליחת התראות");
}]);
