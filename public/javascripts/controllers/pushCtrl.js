angular.module('marshalApp')
.controller('pushCtrl', ['$scope', '$filter' , 'httpService', '$mdDialog', function($scope, $filter, httpService, $mdDialog){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "שליחת התראות");
    

    // Entities
    $scope.selectedCourses = [];
    $scope.notification = {
        "data": {"type": "notification", "title": "", "content": ""},
        "channels": [],
        "courses": []
    };

    /**
     * Get information needed 
     */
    httpService.get('/api/courses?light=true').then((res) => {
        $scope.courses = res.data;
        
        // To prevent two reconnection dialogs
        httpService.get('/api/fcm/channels').then((res) => {
            $scope.channels = res.data;
        });
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
                $scope.notification.courses.push(item.id);
                console.log($scope.selectedCourses);
                console.log($scope.notification.courses);
            }

            $scope.courseChoose = '';
            $scope.selectedItem = undefined;
        }
    }

    /**
     * Updates the notification entity when removing a course from the list
     */
    $scope.updateNotification = function() {
        var currIndex = 0;
        $scope.notification.courses.forEach((id) => {
            if($scope.selectedCourses.map(function(e) { return e.id; }).indexOf(id) == -1) {
                $scope.notification.courses.splice(currIndex, 1);
            }
            currIndex++;
        });
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
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
        return ($scope.notification.channels.length !== 0 &&
            $scope.notification.channels.length !== $scope.channels.length);
    };

    $scope.isChecked = function() {
        return $scope.notification.channels.length === $scope.channels.length;
    };

    $scope.toggleAll = function() {
        if ($scope.notification.channels.length === $scope.channels.length) {
        $scope.notification.channels = [];
        } else if ($scope.notification.channels.length === 0 || $scope.notification.channels.length > 0) {
        $scope.notification.channels = $scope.channels.slice(0);
        }
    };

    /** Confirmation */

    $scope.confirm = function(event) {
        var isFullScreen = false;
        $mdDialog.show({
            parent: angular.element(document.body),
            controller: 'comfirmPushCtrl',
            scope: $scope,
            preserveScope: true,
            templateUrl: 'javascripts/templates/confirmPushDialog.html',
            clickOutsideToClose:false,
            fullScreen: isFullScreen,
            autoWrap: false
        }).then(function() {});
    }
}])
.controller('comfirmPushCtrl', ['$scope', 'httpService', '$interval', '$mdDialog', function($scope, httpService, $interval, $mdDialog) {
    $scope.wait = 10;
    var stop = $interval(function(){
         $scope.wait--;

        if($scope.wait == 0) {
            $scope.finishCount();
        }
    }, 1000);

    $scope.finishCount = function() {
        $interval.cancel(stop);
        stop = undefined;
    }

    $scope.doCancel = function() {
        $mdDialog.cancel();
        $scope.finishCount();
    }

    $scope.sendPush = function() {
        httpService.postSecure('/api/fcm/sendpush/', $scope.notification).then((res) => {
            console.log(res);
        })
    }
}]);
