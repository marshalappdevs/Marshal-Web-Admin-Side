angular.module('marshalApp')
.controller('meetupsCtrl', ['$scope','httpService', function($scope, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מיטאפים");

}]);
