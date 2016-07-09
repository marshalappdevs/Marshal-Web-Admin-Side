angular.module('marshalApp')
.controller('malshabCtrl', ['$scope', function($scope){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מידע למלש\"בים");
}]);
