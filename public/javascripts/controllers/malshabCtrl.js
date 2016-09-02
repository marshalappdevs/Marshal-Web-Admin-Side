angular.module('marshalApp')
.controller('malshabCtrl', ['$scope','$mdDialog','httpService', function($scope,$mdDialog,httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מידע למלש\"בים");
    
    var getcards = function (){
        httpService.get("/api/malshabitems/").then(function (response){
//        $scope.isLoading = false;
        $scope.malshabcards = response.data;
        });  
    }; 
    
    $scope.deletecard = function(event, malshab, httpService){
            $mdDialog.show({
                  locals:{malshab:malshab},
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  template: '<md-dialog aria-label="item.Name"  ng-cloak>'+
                                '<form>'      +
                                    '<md-toolbar>'    +    
                                    '<div style="padding-right:10px;padding-bottom:10px;padding-left:10px;">'+
                                    '<span><center><ng-md-icon icon="warning" size="66"></center></span>'+
                                    
                                    'האם אתה בטוח שברצונך למחוק את הפריט - '+ 
                                    '<br>'+
                                    '<div><center>"'+malshab.title+'"</center></div>'+
                                    '</div>'+
                                    '</md-toolbar>'+
                                    '<md-dialog-content class="dialogcontent" dir="rtl" style="padding-left: 70px;padding-right:10px;" margin="right">'+
                                    '<p>'+
                                        '<br><md-input-container class="md-block" flex-gt-sm>'+
                                        '<label style="left: 130px">שם משתמש:</label>'+
                                        '<input id="username">'+
        	                            '</md-input-container>'+  
                                    '</p>'+
                                    '<p>'+
                                        '<br><md-input-container class="md-block" flex-gt-sm>'+
                                        '<label style="left: 130px;">סיסמא:</label>'+
                                        '<input type="password" id="password" ng-model="pass">'+
        	                            '</md-input-container>'+  
                                    '</p>'+
                                    '</md-dialog-content>'+
                                    '<md-dialog-actions layout="row">'+
                                        '<span flex></span>'+
                                        '<md-button ng-click="cancelthis()"><ng-md-icon icon="cancel"></ng-md-icon>                  ביטול            </md-button>'+
                                        '<md-button ng-click="confirm()"><ng-md-icon icon="save"></ng-md-icon>                   מחק            </md-button>'+
                                    '</md-dialog-actions>'+
                                '</form>'+
                            '</md-dialog>',                           
                 
                    controller: function DialogController($scope, $mdDialog, malshab, httpService) {
                                    $scope.hide = function(answer) {
                                        $mdDialog.hide(answer);
                                    };
                                    $scope.cancelthis = function(answer) {
                                        $mdDialog.hide(answer);
                                    };
                                    $scope.confirm = function(){                                        
                                        alert($scope.pass);
                                        httpService.delete("/api/malshabitems/"+malshab._id).then(function (response){ 
                                            swal("נמחק", "הקורס נמחק !", "error");
                                            getcards();
                                            $mdDialog.hide();
                                        });
                                    };
        
                                }
               });
    };

    getcards();
    
    $scope.editcard = function(event, malshab, httpService){
        $mdDialog.show({
                  locals:{malshab:malshab},
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  template: '<md-dialog aria-label="item.Name"  ng-cloak>'+
                                '<form>'      +
                                    '<md-toolbar>'    +    
                                        '<div class="md-toolbar-tools">'  + 
                                            '<span style="padding-left: 20px;">  שם מסלול  </span>' +
                                            '<input id="malshabtitle" type="text" name="title" value="'+malshab.title+'">'+  
                                            '<span flex></span>'+
                                            '<md-button class="md-icon-button" ng-click="cancelthis()">' +        
                                            '<md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">' + 
                                            '</md-icon>            X           </md-button>'+
                                        '</div>'+
                                    '</md-toolbar>'+
                                    '<md-dialog-content class="dialogcontent" dir="rtl" margin="right">'+
                                        '<div class="md-dialog-content">'+
                                            '<p>'+
                                                '<br><md-input-container class="md-block" flex-gt-sm>'+
                                                '<label style="left: 130px;">קישור למסלול:</label>'+
                                                '<input id="malshaburl" value="'+ malshab.url +'">'+
        	                                    '</md-input-container>'+  
                                            '</p>'+
                                            '<p>'+
                                                '<br><md-input-container class="md-block" flex-gt-sm>'+
                                                '<label style="left: 130px;">נתיב תמונה:</label>'+
                                                '<input id="malshabimageurl" value="'+ malshab.imageUrl +'">'+
        	                                    '</md-input-container>'+  
                                            '</p>'+
                                        '</div>'+
                                    '</md-dialog-content>'+
                                    '<md-dialog-actions layout="row">'+
                                        '<span flex></span>'+
                                        '<md-button ng-click="cancelthis()"><ng-md-icon icon="cancel"></ng-md-icon>                  ביטול            </md-button>'+
                                        '<md-button ng-click="updatemalshab()"><ng-md-icon icon="save"></ng-md-icon>                   שמור            </md-button>'+
                                    '</md-dialog-actions>'+
                                '</form>'+
                            '</md-dialog>',                           
                 
                    controller: function DialogController($scope, $mdDialog, malshab, httpService) {
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
        
                                }
               });
        
    };
}]);


function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
