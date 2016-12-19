angular.module('marshalApp')
.controller('materialsCtrl', ['$scope', '$filter', 'httpService','$mdDialog', '$mdMedia', function($scope, $filter, httpService, $mdDialog, $mdMedia){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "חומרי עזר ולימוד");
    console.log($filter);
    $scope.selectedCourses = [];

    $scope.loadMaterials = function() {
        httpService.get('/api/materials').then(function(res) {
            $scope.materials = res.data;
        })
    }

    $scope.loadMaterials();

    $scope.addDialog = function(event, index) {
        $scope.index = index;
        var isFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
            controller: 'materialsEditCtrl',
            scope: $scope,
            preserveScope: true,
            templateUrl: 'javascripts/templates/addMaterialsDialog.html',
            clickOutsideToClose:false,
            fullScreen: isFullScreen
        }).then(function() {$scope.loadMaterials();});
    }
    
    $scope.removeMaterial = function(index) {
        httpService.delete('/api/materials/' + $scope.materials[index]._id).then(function(res) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('החומר הוסר!')
                    .textContent('')
                    .ariaLabel('DeleteSuccess')
                    .ok('יש!')
            );
            $scope.loadMaterials();
        }, function(err) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('לא הצלחנו להסיר את החחומר')
                    .textContent('')
                    .ariaLabel('DeleteFail')
                    .ok('איזה באסה..')
            )});
    }
}])
.controller('materialsEditCtrl', ['$scope', '$filter', 'httpService','$mdDialog', '$mdMedia', function($scope, $filter, httpService, $mdDialog, $mdMedia){
     $scope.idHashTags = [];
     $scope.doCancel = function() {
        $scope.preview = null;
        $scope.url = null;
        $scope.isEdit = false;
        $mdDialog.hide();};

    /**
     * This function is called on the dialog initialization
     * it checks whether it is an edit to an existing material or an addition
     */
    $scope.checkEdit = function() {
        if($scope.index != undefined) {
            $scope.isEdit = true;
            $scope.preview = $scope.materials[$scope.index];
            $scope.url = $scope.materials[$scope.index].url;
        };
    }



    $scope.addMaterial = function() {
        var material = {
                        url: $scope.preview.url,
                        hashTags: $scope.preview.hashTags,
                        title: $scope.preview.title,
                        description: $scope.preview.description,
                        baseUrl: $scope.preview.baseUrl,
                        imageUrl: $scope.preview.imageUrl
            };

        httpService.post('/api/materials', material).then(function(res) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('החומר נוסף!')
                    .textContent('')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('יש!')
            );
        }, function(err) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('לא הצלחנו להוסיף את החחומר')
                    .textContent(err)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('איזה באסה..')
            );
        });

        /**
         * In order to close the dialog
         */
        $scope.doCancel();
    };

    /**
     * This method checks for URL validicy to restrict http requests
     */
    $scope.urlDigest = function () {
        var urlRegEx = /([a-z]+\:\/+)([^\/\s]*)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ \#]*)#?([^ \#]*)/ig;

        if(!urlRegEx.exec($scope.url)) {
            $scope.warning = "הכנס URL נכון";
        } else {
            httpService.post('/api/materials/preview/', {urlToDigest: $scope.url}).then(function(res) {
                $scope.preview = res.data;
                console.log(res.data);
            })
        }
    }


        /* Filter for the autocomplete */
     $scope.querySearch = function (query) {
      return $filter('filter')($scope.courses, {text: query});
    }

    /**
     * Add courses to selected courses
     */
    $scope.selectedItemChange = function(item) {
        if(item) {
            if(item.id) {
                // Check if this id already exists
                $scope.selectedCourses.forEach((course) => {
                    if(course.id == item.id) {
                        $scope.bExists = true;
                    }
                })
            }

            // If it doesnt exist on the array, add it!
            if(!$scope.bExists) {
                $scope.idHashTags.push("#"+ item.id);
            }

            $scope.courseChoose = '';
            $scope.selectedItem = undefined;
        }
    }

    /**
     * Updates the notification entity when removing a course from the list
     */
    $scope.updateNotification = function(item) {
        var currIndex = 0;
        $scope.idHashTags.forEach((id) => {
            if($scope.selectedCourses.map(function(e) { return e.id; }).indexOf(id) == -1) {
                $scope.idHashTags.splice(currIndex, 1);
            }
            currIndex++;
        });
    }

        /**
     * Get information needed 
     */
    httpService.get('/api/courses?light=true').then((res) => {
        $scope.courses = res.data;
    });

}]);

