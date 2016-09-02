angular.module('marshalApp')
.controller('materialsCtrl', ['$scope', 'httpService','$mdDialog', '$mdMedia', function($scope, httpService, $mdDialog, $mdMedia){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "חומרי עזר ולימוד");

    $scope.addDialog = function(event) {
        var isFullScreen = $mdMedia('sm') || $mdMedia('xs');
        return $mdDialog.show({
            controller: 'materialsCtrl',
            templateUrl: 'javascripts/templates/addMaterialsDialog.html',
            targetEvent: event,
            clickOutsideToClose:true,
            fullScreen: isFullScreen
        });
    }

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
}]).filter('splitrow', function(){
		return function (input, count){
			var out = [];
				if(typeof input === "Object"){
		  			for (var i=0, j=input.length; i < j; i+=count) {
		  	    		out.push(input.slice(i, i+count));
		  			}
		  		}
	   		return out;
		}
});