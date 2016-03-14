angular.module('marshalApp')
    .controller('coursesCtrl', ['$scope', '$uibModal', 'selectedCourse', 'courseHandler', 'dragDrop', function($scope, $uibModal, selectedCourse, courseHandler, dragDrop) {
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
        
        $scope.delete = function(id) {
            courseHandler.deleteCourse(id);
        };
        
        var dragDropDiv = document.getElementById('courseTableDiv');
        dragDropDiv.addEventListener('dragenter', dragDrop.allowDrop);
        dragDropDiv.addEventListener('dragover', dragDrop.allowDrop);
        dragDropDiv.addEventListener('drop', dragDrop.drop);
    }]);