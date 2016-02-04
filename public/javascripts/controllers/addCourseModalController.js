angular.module('marshalApp')
    .controller('addCourseModalCtrl', ['$scope', '$uibModalInstance', 'propGetter', 'courseHandler', function($scope, $uibModalInstance, propGetter, courseHandler) {
        $scope.columns = propGetter.getPropNames();
        $scope.addCourse = function() {
            // Getting new course template from service
            var newCourse = courseHandler.getCourseTemplate();
            
            // Putting each property we get from the inputs to the new object
            $scope.columns.forEach(x => newCourse[x.realName] = x.value);
            
            // Pushes the new course to the course list and closes the modal
            courseHandler.addCourse(newCourse);
            $uibModalInstance.close();
        }
    }]);