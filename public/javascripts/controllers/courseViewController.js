angular.module('marshalApp')
    .controller('courseModalCtrl', ['$scope', '$uibModalInstance', '$sce', 'selectedCourse', 'propGetter', function($scope, $uibModalInstance, $sce, selectedCourse, propGetter) {
        $scope.toDisplay = selectedCourse.course;
        $scope.columns = propGetter.getPropNames();
        
        $scope.trustAsHtml = function(htmlStr) {
            return $sce.trustAsHtml(htmlStr);
        }
    }]);