angular.module('marshalApp')
    .controller('courseModalCtrl', ['$scope', '$uibModalInstance', '$sce', 'selectedCourse', 'propGetter', 'Upload', '$http', 'courseHandler', function($scope, $uibModalInstance, $sce, selectedCourse, propGetter, Upload, $http, courseHandler) {
        var vm = this;
        vm.toDisplay = selectedCourse.course;
        
        vm.columns = propGetter.getPropNames();
        
        // Image upload stuff
        
        vm.submit = function() {
            if (vm.upload_form.$valid && vm.file) {
                vm.upload(vm.file);
            } else if (vm.fileUrl) {
                vm.upload(vm.fileUrl);
                // $http.get(vm.fileUrl)
                // .then(function(result) {
                //     vm.upload(result);
                // });
            }
        };
        
        vm.upload = function(file) {
            // Checks if the parameter of this method is a string (url from the web) or an object (file from disk)
            if (typeof file === 'string') {
                $http.post('/api/images', { imageUrl : file })
                .then(function(resp) {
                    console.log('Success, image has been uploaded!');
                    vm.progress = 'Finished!';
                    selectedCourse.course.PictureUrl = resp.data.filename; 
                    courseHandler.updateCourse(selectedCourse.course);
                });
            } else {
                Upload.upload({
                    url: '/api/images',
                    data: {file : file}
                }).then(function(resp) {
                    if (resp.data.error_code === 0) {
                        console.log('Success ' + resp.config.data.file.name + 'uploaded.');
                        vm.progress = 'Finished!';
                        selectedCourse.course.PictureUrl = resp.data.filename; 
                        courseHandler.updateCourse(selectedCourse.course);
                    } else {
                        console.log('an error occured' + resp.data.err_desc.code);
                    }
                }, function(resp) {
                    // In case of error
                    console.log('Error status: ' + resp.status);
                }, function(evt) {
                    // Progress updating
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% ';
                });
            }
        };
    }]);