angular.module('marshalApp')
    .controller('coursesCtrl', ['$scope', '$uibModal', 'selectedCourse', 'courseHandler', function($scope, $uibModal, selectedCourse, courseHandler) {
        $scope.courses = courseHandler.getCourses();
        $scope.buildCourseObj = function(name, desc, price) {
            return { name: name, desc: desc, price: price };
        };

        $scope.addCourse = function(course, event) {
            if (event.keyCode === 13) {
                $scope.courses.push(course);
                $scope.newName = "";
                $scope.newDesc = "";
                $scope.newPrice = "";
            }
        };
        
        $scope.open = function(selected) {
            selectedCourse.course = selected;
            $uibModal.open(
                {
                    animation: true,
                    templateUrl: 'courseModal',
                    controller: 'courseModalCtrl'
                }
            );
        };
        
        $scope.add = function() {
            $uibModal.open(
                {
                    animation: true,
                    templateUrl: 'addCourseModal',
                    controller: 'addCourseModalCtrl'
                }
            );
        };
    }]);