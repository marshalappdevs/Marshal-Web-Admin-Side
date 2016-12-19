angular.module('marshalApp')
.controller('courseUploadCtrl', ['$scope', '$mdDialog','httpService', 'Upload', '$q', function($scope, $mdDialog, httpService, Upload, $q){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "העלאת קורסים");

    $scope.updateList = function (files, event) {
        $scope.files = event.target.files;
        $scope.filesToUpload = event.target.files;
        
        angular.forEach($scope.files, function(currFile, index) {
            if(currFile.name.substring(currFile.name.lastIndexOf('.')) != ".json") {
                currFile.status = "X";
                currFile.message = "לא קובץ JSON";
                currFile.uploadStarted = true // To indicate no loading
            } else {
                currFile.uploadStarted = false;
                currFile.status = "pending";
                currFile.message = "ממתין להעלאה"
            }
        }, this);
    }

    $scope.beginProcess = function() {
        angular.forEach($scope.files, function(currFile, index) {
            if(currFile.status == "pending") {
                setTimeout(function(){ 
                    $scope.upload($scope.filesToUpload[index], currFile);
                }, 1000);
            }
        }, this);
    }
    $scope.upload = function (realFile, viewFile) {
        viewFile.uploadStarted =true;
         Upload.upload({
            url: '/api/courses/json',
            data: {file: realFile}
        }).then(function (resp) {
            console.log(resp.data);
            viewFile.status = "V";
            viewFile.message = resp.data;
        }, function (resp) {
            viewFile.status = "X";
            viewFile.message = resp.data;
        }, function (evt) {
            viewFile.percentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
}]);

