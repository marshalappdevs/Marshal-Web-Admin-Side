angular.module('marshalApp')
.directive('linkCard', function() {
    return {
        restrict: 'E',
        templateUrl: 'javascripts/templates/linkCard.html',
        scope: {
            preview: '=link',
            index: '=index',
            edit: '&edit',
            delete: '&delete'
        },
        controller: function($scope) {
            $scope.openLink = function() {window.open($scope.preview.url,'_blank');};
        }
    };
})