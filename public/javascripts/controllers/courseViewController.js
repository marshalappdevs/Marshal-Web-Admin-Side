angular.module('marshalApp')
    .controller('courseModalCtrl', ['$scope', '$uibModalInstance', '$sce', 'selectedCourse', 'propGetter', 'Upload', '$http', function($scope, $uibModalInstance, $sce, selectedCourse, propGetter, Upload, $http) {
        $scope.toDisplay = selectedCourse.course;
        
        $scope.columns = propGetter.getPropNames();
        
        // Image upload stuff
        
        $scope.submit = function() {
            if ($scope.upload_form.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };
        
        $scope.upload = function(file) {
            Upload.upload({
                url: '/api/images',
                data: {file : file}
            }).then(function(resp) {
                if (resp.data.error_code === 0) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded.');
                    $scope.progress = 'Finished!';
                    //selectedCourse.course.PictureUrl = 
                } else {
                    console.log('an error occured' + resp.data.err_desc.code);
                }
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $scope.progress = 'progress: ' + progressPercentage + '% ';
            });
        };
    }]);