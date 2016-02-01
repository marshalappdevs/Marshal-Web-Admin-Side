angular.module('marshalApp')
    .controller('addCourseModalCtrl', ['$scope', '$uibModalInstance', 'propGetter', function($scope, $uibModalInstance, propGetter) {
        $scope.columns = propGetter.getPropNames();
    }]);