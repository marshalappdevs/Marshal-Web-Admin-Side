angular.module('marshalApp')
    .directive('courseField', function() {
        return {
            restrict: 'E',
            scope: {
                filedName: '@name',
                content: '=?'
            },
            templateUrl: "courseField"
        };
    });