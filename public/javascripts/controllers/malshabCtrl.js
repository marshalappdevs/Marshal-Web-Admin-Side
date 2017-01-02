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
    
    $scope.hide = function(answer) {
    $mdDialog.hide(answer);
    };

    $scope.cancelthis = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.refreshForm = function(){
        $scope.malshab = null;
    };

    // delete malshab item
    $scope.deletecard = function(event, malshab){
        httpService.delete("/api/malshabitems/"+malshab._id, {})
        .then(function(res) {
           swal("נמחק", "הקורס נמחק בהצלחה!", "success");
            getcards();
            },function(res){
                swal("בעיה", "הייתה בעיה במחיקה!", "error");
            });
    };
    
    // edit malshab item
    $scope.editcard = function(event, malshab, httpService){
        $scope.malshabToUpdate = malshab;
       return $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/editMalshabItem.html',         
                  controller: 'malshabCtrl'
               });
    };

// after changing the malshab item save it
$scope.updatemalshab = function(){                                        
    
    // creating the new malshab item
    var newmalshab = {_id:$scope.malshabToUpdate._id,
                      title:document.getElementById("malshabtitle").value,
                      url:document.getElementById("malshaburl").value,
                      imageUrl:document.getElementById("malshabimageurl").value,
                      order:document.getElementById("malshaborder").value};
    
    // send it to the httpservice to save the changes
    httpService.put("/api/malshabitems/"+newmalshab._id, {malshabToUpdate:newmalshab}).then(function (response){
    swal("נשמר", "פרטי הקורס נשמרו!", "success");
    getcards();
    $mdDialog.hide();
    });
};

$scope.addcard = function(){
    return $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/addMalshabItem.html',         
                  controller: 'malshabCtrl'
               });
    };

$scope.saveNewMalshab = function () {
    if($scope.malshab == undefined ||
       $scope.malshab.title == undefined ||
       $scope.malshab.url == undefined ||
       $scope.malshab.imageUrl == undefined ||
       $scope.malshab.order == undefined ){
        swal("בעיה", "חובה למלא את כל השדות!", "error");
    }
    else {
        // creating the new malshab item
        var newmalshab = {title:$scope.malshab.title,
                      url:$scope.malshab.url,
                      imageUrl:$scope.malshab.imageUrl,
                      order:$scope.malshab.order};

        httpService.post("/api/malshabitems/", {newmalshab:newmalshab}).then(function(res) {
            swal("נוסף", "הקורס נוסף בהצלחה!", "success");
            getcards();
            $scope.refreshForm();
            $mdDialog.hide();
            },function(res){
                swal("בעיה", "הייתה בעיה בהוספה!", "error");
                refreshForm();
                $mdDialog.hide();
            });
    }
    
};
}]);

