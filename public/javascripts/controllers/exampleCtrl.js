angular.module('marshalApp')
.controller('ExampleCtrl', ['$scope', '$mdDialog','httpService', function($scope, $mdDialog, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "ראשי וסטטיסטיקות");

    httpService.get('/dashboard2').then(function(response) {
      console.log(response.data);
    })

    $scope.activity = [
      {
        what: 'דף זה בפיתוח',
        who: 'צוות BasmApp',
        when: '3:08PM',
        notes: ""
      }
    ];
}]);

