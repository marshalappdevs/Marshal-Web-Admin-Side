angular.module('marshalApp')
.controller('courseUploadCtrl', ['$scope', '$mdDialog','httpService', function($scope, $mdDialog, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "העלאת קורסים");

    $scope.updateList = function (files, event) {
        $scope.files = event.target.files;
        $scope.filesToUpload = event.target.files;
        console.log($scope.files);
        
        angular.forEach($scope.files, function(currFile) {
            currFile.uploadStarted = false;
            currFile.status = "pending";
        }, this);
    }

    $scope.upload = function () {
         Upload.upload({
            url: 'upload/url',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }
}]);

