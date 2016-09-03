angular.module('marshalApp')
.controller('materialsCtrl', ['$scope', 'httpService','$mdDialog', '$mdMedia', function($scope, httpService, $mdDialog, $mdMedia){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "חומרי עזר ולימוד");

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
        httpService.delete('/api/materials/' + encodeURIComponent($scope.materials[index]._id)).then(function(res) {
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
.controller('materialsEditCtrl', ['$scope', 'httpService','$mdDialog', '$mdMedia', function($scope, httpService, $mdDialog, $mdMedia){
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
            httpService.post('/api/preview/', {urlToDigest: $scope.url}).then(function(res) {
                $scope.preview = res.data;
                console.log(res.data);
            })
        }
    }
}]);