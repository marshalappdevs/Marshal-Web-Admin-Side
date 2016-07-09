angular.module('marshalApp')
.controller('coursesCtrl', ['$scope', function($scope){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "קורסים והשתלמויות");
}]);
