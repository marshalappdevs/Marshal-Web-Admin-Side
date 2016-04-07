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
        
        // Drag & drop stuff
        
        $scope.showDDSplash = false;
        
        $scope.dragEnter = function dragEnter(ev) {
            ev.preventDefault();
            $scope.showDDSplash = true;
            $scope.$apply();
        }
        
        $scope.allowDrop = function allowDrop(ev) {
            ev.preventDefault();
        }
        
        $scope.drop = function drop(ev) {
            $scope.showDDSplash = false;
            $scope.$apply();
            
            var reader = new FileReader();
            reader.onloadend = function() {
                try {
                    var data = JSON.parse(this.result);
                    
                    // Adding the course to the table
                    courseHandler.addCourse(data);
                } catch (e) {
                    alert("Bad file");
                }
            };
            
            reader.onprogress = function(event) {
                if (event.lengthComputable) {
                    // progressNode.max = event.total;
                    // progressNode.value = event.loaded;
                }
            };
            
            reader.readAsText(ev.dataTransfer.files[0]);
            ev.preventDefault();
        }
        
        var dragDropDiv = document.getElementById('mainBody');
        dragDropDiv.addEventListener('dragenter', $scope.dragEnter);
        dragDropDiv.addEventListener('dragover', $scope.allowDrop);
        dragDropDiv.addEventListener('drop', $scope.drop);
    }]);