angular.module('marshalApp')
    .controller('courseModalCtrl', ['$scope', '$uibModalInstance', '$sce', 'selectedCourse', 'propGetter', 'Upload', '$http', function($scope, $uibModalInstance, $sce, selectedCourse, propGetter, Upload, $http) {
        var vm = this;
        vm.toDisplay = selectedCourse.course;
        
        vm.columns = propGetter.getPropNames();
        
        // Image upload stuff
        
        vm.submit = function() {
            if (vm.upload_form.$valid && vm.file) {
                vm.upload(vm.file);
            }
        };
        
        vm.upload = function(file) {
            Upload.upload({
                url: '/api/images',
                data: {file : file}
            }).then(function(resp) {
                if (resp.data.error_code === 0) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded.');
                    vm.progress = 'Finished!';
                    selectedCourse.course.PictureUrl = resp.data.filename; 
                } else {
                    console.log('an error occured' + resp.data.err_desc.code);
                }
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% ';
            });
        };
    }]);