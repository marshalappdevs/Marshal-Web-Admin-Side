angular.module('marshalApp')
.controller('materialsCtrl', ['$scope', function($scope){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "חומרי עזר ולימוד");
}]);
