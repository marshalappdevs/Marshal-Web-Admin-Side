angular.module('marshalApp')
    .directive('courseField', function() {
        return {
            restrict: 'E',
            scope: {
                fieldName: '@name',
                content: '=?'
            },
            templateUrl: "courseField"
        };
    });