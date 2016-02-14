angular.module('marshalApp')
    .directive('courseFiled', function() {
        return {
            restrict: 'E',
            scope: {
                filedName: '@name',
                content: '=?'
            },
            templateUrl: "" // TODO: put matching jade file here
        };
    });