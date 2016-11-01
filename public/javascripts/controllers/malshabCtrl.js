angular.module('marshalApp')
.controller('malshabCtrl', ['$scope','$mdDialog','httpService', function($scope,$mdDialog,httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מידע למלש\"בים");
    
    var getcards = function (){
        httpService.get("/api/malshabitems/").then(function (response){
        $scope.malshabcards = response.data;
        });  
    }; 
    getcards();

    $scope.deletecard = function(event, malshab, httpService){
           return $mdDialog.show({
                //   locals:{malshab:malshab},
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/deleteMalshabItem.html',                           
                 controller: 'malshabCtrl'                                   
               });
    };
    
    $scope.editcard = function(event, malshab, httpService){
       return $mdDialog.show({
                //   locals:{malshab:malshab},
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/editMalshabItem.html',         
                  controller: 'malshabCtrl'
               });
    };

    
$scope.hide = function(answer) {
    $mdDialog.hide(answer);
};

$scope.cancelthis = function(answer) {
    $mdDialog.hide(answer);
};

$scope.updatemalshab = function(){                                        
    var newmalshab = {_id:malshab._id,
                      title:document.getElementById("malshabtitle").value,
                      url:document.getElementById("malshaburl").value,
                      imageUrl:document.getElementById("malshabimageurl").value};
    httpService.put("/api/malshabitems/"+malshab._id, newmalshab).then(function (response){
    swal("נשמר", "פרטי הקורס נשמרו!", "success");
    getcards();
    $mdDialog.hide();
    });
};

$scope.confirm = function(){                                        
    alert($scope.pass);
    httpService.delete("/api/malshabitems/"+malshab._id).then(function (response){ 
        swal("נמחק", "הקורס נמחק !", "error");
        getcards();
        $mdDialog.hide();
    });
};

// function DialogController($scope, $mdDialog) {
//   $scope.hide = function() {
//     $mdDialog.hide();
//   };

//   $scope.answer = function(answer) {
//     $mdDialog.hide(answer);
//   };
// };

}]);

