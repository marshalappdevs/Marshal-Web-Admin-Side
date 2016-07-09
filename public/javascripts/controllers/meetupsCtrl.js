angular.module('marshalApp')
.controller('meetupsCtrl', ['$scope', function($scope){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מיטאפים");
}]);
