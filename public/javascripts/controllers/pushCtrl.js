angular.module('marshalApp')
.controller('pushCtrl', ['$scope', '$filter' , 'httpService', function($scope, $filter, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "שליחת התראות");
    
    $scope.selectedCourses = [];

    /**
     * Get information needed 
     */
    httpService.get('/api/courses?light=true').then((res) => {
        $scope.courses = res.data;
    });

    httpService.get('/api/channels').then((res) => {
        $scope.channels = res.data;
    });


    /* ----------------- Courses-------------------------------- */
    
    /* Filter for the autocomplete */
     $scope.querySearch = function (query) {
      return $filter('filter')($scope.courses, {text: query});
    }

    /**
     * Add courses to selected courses
     */
    $scope.selectedItemChange = function(item) {
        if(item) {
            var bExists = false;

            // Check if this id already exists
            $scope.selectedCourses.forEach((course) => {
                if(course.id == item.id) {
                    bExists = true;
                }
            })

            // If it doesnt exist on the array, add it!
            if(!bExists) {
                $scope.selectedCourses.push(item);
                console.log($scope.selectedCourses);
            }

            $scope.courseChoose = '';
            $scope.selectedItem = undefined;
        }
    }

    /**
     * Removes a course from the list
     */
    $scope.removeCourse = function(id) {
          var idToRemove = $scope.selectedCourses.map(function(e) { return e.id; }).indexOf(id);
          $scope.selectedCourses.splice(idToRemove, 1);
    }

    /* --------------Channels------------------ */
    $scope.selected = [];
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
        list.splice(idx, 1);
        }
        else {
        list.push(item);
        }

        console.log($scope.selected);
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
        return ($scope.selected.length !== 0 &&
            $scope.selected.length !== $scope.channels.length);
    };

    $scope.isChecked = function() {
        return $scope.selected.length === $scope.channels.length;
    };

    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.channels.length) {
        $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        $scope.selected = $scope.channels.slice(0);
        }
    };
}]);
