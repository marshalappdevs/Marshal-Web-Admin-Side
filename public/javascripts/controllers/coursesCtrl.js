angular.module('marshalApp')
.controller('coursesCtrl', ['$scope','$mdDialog','$mdMedia','httpService', function($scope,$mdDialog, $mdMedia,httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "קורסים והשתלמויות");

    $scope.isLoading = true;

    $scope.alertfunc = function(name) {
        alert("You choose: " + name.Name);
    };

    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


     $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#card')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

  $scope.currpicurl;
  $scope.showCustom = function(event, item) {
    $scope.currcyclelist = item.cycleList;
               $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  template: '<md-dialog aria-label="item.Name"  ng-cloak class="animated zoomInDown">'+
                            '      <form>'+
                            '      <md-toolbar>'+
                            '      <div class="md-toolbar-tools">'+
                            '        <h2>' +item.Name + '</h2>'+
                            '        <span flex></span>'+
                            '        <md-button class="md-icon-button" ng-click="cancel()">'+
                            '        <md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">'+
                            '        </md-icon>            X           </md-button>'+
                            '       </div>'+
                            '        </md-toolbar>'+
                            '        <md-dialog-content>'+
                            '        <div class="md-dialog-content">'+
                            '        <center><img class="md-card-image-dialog" ng-src="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'" alt="Washed Out">'+
                            '</center>'+
                            '        <p>'+
                            '            <b>סימול:</b>' + item.CourseCode + 
                            '        </p>'+
                            '        <p>'+
                            '            <b>תיאור כללי:</b>' +item.Description + 
                            '        </p>'+
                            '        <p>'+
                            '            <b>סילבוס:</b>' + item.Syllabus + 
                            '        </p>'+
                            '        <p>' +
                            '            <b>אוכלוסיית יעד:</b>' + item.TargetPopulation + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>זמן ביום:</b>' + item.DayTime + 
                            '        </p>'+
                            '       <p>'+
                            '            <b>מספר ימים:</b>' + item.DurationInDays + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>ציון מעבר:</b>' + item.PassingGrade + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>מחיר:</b>' + item.Price + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>מינימום שתתפים:</b>' + item.MinimumPeople + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>מקסימום משתתפים:</b>' + item.MaximumPeople + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>תגובות:</b>' + item.Comments + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>קטגוריה:</b>' + item.Category +       
                            '</p>'+
                            '         <p>'+
                            '            <b>האם מיטאפ:</b>' + item.IsMeetup + 
                            '        </p>'+
                            '         <p>'+
                            '            <b>רשימת מחזורים:</b>' +
                            '<select>'+
                                  '<option ng-repeat="course in currcyclelist">{{convertdate(course.StartDate)}}       ->       {{convertdate(course.EndDate)}}</option>'+
                            '</select>'+
                            '        </p>'+
                            '     </div>'+
                            '        </md-dialog-content>'+
                            '        <md-dialog-actions layout="row">'+
                            '        <md-button href="https://www.google.co.il/?gfe_rd=cr&ei=2buVV9j7B4_b8Ae6lqm4Cg#q='+ item.Name+ '" target="_blank" md-autofocus><ng-md-icon icon="school"></ng-md-icon>'+
                            '            More on google           </md-button>'+
                            '       <span flex></span>'+
                            '       <md-button ng-click="cancelthis()"><ng-md-icon icon="cancel"></ng-md-icon>                  ביטול            </md-button>'+
                            '      <md-button ng-click="save()"><ng-md-icon icon="save"></ng-md-icon>                   שמור            </md-button>'+
                            '   <md-button ng-click="edit()"><ng-md-icon icon="border_color"></ng-md-icon>    ערוך  </md-button>'+
                            '   </md-dialog-actions>'+
                            '      </form>'+
                            '</md-dialog>',                           
                 controller: function DialogController($scope, $mdDialog) {
                              $scope.hide = function(answer) {
                                $mdDialog.hide(answer);
                              };
                              $scope.cancel = function() {
                                //swal({   title: "חזרנו!",   text: "",   timer: 1000,   showConfirmButton: false, imageUrl:"http://admissions.colostate.edu/media/sites/19/2014/07/icon_books-011-1024x1024.png"});
                                $mdDialog.hide();
                              };
                              // $scope.cancel = function() {
                              //   $mdDialog.cancel();
                              // };
                              // $scope.answer = function(answer) {
                              //   $mdDialog.hide(answer);
                              // };
                              $scope.save = function(answer) {
                                swal("נשמר", "פרטי הקורס נשמרו!", "success")
                                $mdDialog.hide(answer);
                              };
                              $scope.edit = function(answer) {
                                //swal({   title: "עריכה!",   text: "<span style='color:#F8BB86'><h3>ברוך הבא למסך העריכה</h3><span>",   html: true });
                                swal({   title: "עריכה!",   text: "ברוך הבא למסך העריכה",   imageUrl:"http://dialogcivic.gov.ro/wp-content/uploads/2016/01/icon-sign-up.png" });
                                $mdDialog.hide(answer);
                                $scope.editdialog(event, item);
                              };
                              $scope.cancelthis = function(answer) {
                                sweetAlert("בוטל", "השינויים בוטלו!", "error");
                                $mdDialog.hide(answer);
                              };

                            }
               });
            };



$scope.ishiidencode = true;

$scope.funca = function (stridofcourse){
  document.getElementById(stridofcourse).hidden = !(document.getElementById(stridofcourse).hidden);
    
};
               $scope.editdialog = function(event, item) {
               $mdDialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        
                  preserveScope: true,           
                  template: '<md-dialog aria-label="item.Name"  ng-cloak>'+
                            '<form>'      +
                            '<md-toolbar>'    +    
                            '<div class="md-toolbar-tools">'  +      
                            '<h2>' +item.Name + '</h2>'+
                            '<input id="cnameinp" type="text" name="FirstName" value="'+item.Name+'">'+  
                            '<span flex></span>'+
                            '<md-button class="md-icon-button" ng-click="cancel()">' +        
                            '<md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">' + 
                            '</md-icon>            X           </md-button>'+
                            '</div>'+
                            '</md-toolbar>'+
                            '<md-dialog-content>'+
                            '<div class="md-dialog-content">'+
                            '<center><img class="md-card-image-dialog" ng-src="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'" alt="Washed Out"></center>'+
                             '<br><input id="cpicurlinp" type="text" name="FirstName" value="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'">'+
                            '<p>'+
                            '<ng-md-icon icon="border_color" ng-click="funca(\'ccoursecodeinp\')"></ng-md-icon><b>סימול:</b>'
                             + item.CourseCode +
                             '<br><input hidden="true" id="ccoursecodeinp" type="text" name="FirstName" value="'+item.CourseCode+'">'+  
                            '</p>'+
                            '<p>'+
                            '<ng-md-icon icon="border_color" ng-click="funca(\'cdescinp\')"></ng-md-icon><b>תיאור כללי:</b>'
                             +item.Description +
                             '<br><input hidden="true" class="descinput" id="cdescinp" type="text" name="FirstName" value="'+item.Description+'">'+  
                             '</p>'+
                            '<p>'+
                            '<ng-md-icon icon="border_color" ng-click="funca(\'csyllinp\')"></ng-md-icon><b>סילבוס:</b>'
                             + item.Syllabus + 
                             '<br><input hidden="true" class="descinput" id="csyllinp" type="text" name="FirstName" value="'+item.Syllabus+'">'+  
                             '        </p>'+
                             '<p>'+
                             '<ng-md-icon icon="border_color" ng-click="funca(\'ctatpopinp\')"></ng-md-icon><b>אוכלוסיית יעד:</b>'
                              + item.TargetPopulation + 
                              '<br><input hidden="true" id="ctatpopinp" type="text" name="FirstName" value="'+item.TargetPopulation+'">'+  
                              '        </p>'+
                              '<p>'+
                              '<ng-md-icon icon="border_color" ng-click="funca(\'cdtimeinp\')"></ng-md-icon><b>זמן ביום:</b>'
                               + item.DayTime + 
                               '<br><input hidden="true" id="cdtimeinp" type="text" name="FirstName" value="'+item.DayTime+'">'+  
                               '        </p>'+
                               '<p>'+
                               '<ng-md-icon icon="border_color" ng-click="funca(\'cdurationinp\')"></ng-md-icon><b>מספר ימים:</b>'
                                + item.DurationInDays + 
                                '<br><input hidden="true" id="cdurationinp" type="text" name="FirstName" value="'+item.DurationInDays+'">'+  
                                '        </p>'+
                                '<p>'+
                                '<ng-md-icon icon="border_color" ng-click="funca(\'cpassgradeinp\')"></ng-md-icon><b>ציון מעבר:</b>'
                                 + item.PassingGrade + 
                                 '<br><input hidden="true" id="cpassgradeinp" type="text" name="FirstName" value="'+item.PassingGrade+'">'+  
                                 '        </p>'+
                                 '<p>'+
                                 '<ng-md-icon icon="border_color" ng-click="funca(\'cpriceinp\')"></ng-md-icon><b>מחיר:</b>'
                                  + item.Price + 
                                  '<br><input hidden="true" id="cpriceinp" type="text" name="FirstName" value="'+item.Price+'">'+  
                                  '        </p>'+
                                  '<p>'+
                                  '<ng-md-icon icon="border_color" ng-click="funca(\'cminpeopleinp\')"></ng-md-icon><b>מינימום שתתפים:</b>'
                                   + item.MinimumPeople + 
                                   '<br><input hidden="true" id="cminpeopleinp" type="text" name="FirstName" value="'+item.MinimumPeople+'">'+  
                                   '        </p>'+
                                   '<p>'+
                                   '<ng-md-icon icon="border_color" ng-click="funca(\'cmaxpeopleinp\')"></ng-md-icon><b>מקסימום משתתפים:</b>'
                                    + item.MaximumPeople + 
                                    '<br><input hidden="true" id="cmaxpeopleinp" type="text" name="FirstName" value="'+item.MaximumPeople+'">'+  
                                    '        </p>'+
                                    '<p>'+
                                    '<ng-md-icon icon="border_color" ng-click="funca(\'ccommentsinp\')"></ng-md-icon><b>תגובות:</b>'
                                     + item.Comments + 
                                     '<br><input hidden="true" id="ccommentsinp" type="text" name="FirstName" value="'+item.Comments+'">'+  
                                     '        </p>'+
                                     '<p>'+
                                     '<ng-md-icon icon="border_color" ng-click="funca(\'ccatgoryinp\')"></ng-md-icon><b>קטגוריה:</b>' 
                                     + item.Category +
                                     '<br>'+
                                     '<select name="food" hidden="true" id="ccatgoryinp" name="category">'+
                                        '<option value="tools">tools</option>'+
                                        '<option value="software">software</option>'+
                                        '<option value="cyber">cyber</option>'+
                                    '</select>'+       
                                     '</p>'+
                                     '<p>'+
                                     '<ng-md-icon icon="border_color" ng-click="funca(\'cismeetupinp\')"></ng-md-icon><b>האם מיטאפ:</b>' 
                                     + item.IsMeetup + 
                                     '<br>'+ 
                                     '<select hidden="true" id="cismeetupinp" name="ismeetup">'+
                                        '<option value="true">true</option>'+
                                        '<option value="false">false</option>'+
                                    '</select>'+ 
                                     '        </p>'+
                                     '</div>'+
                                     '</md-dialog-content>'+
                                     '<md-dialog-actions layout="row">'+
                                     '<md-button href="https://www.google.co.il/?gfe_rd=cr&ei=2buVV9j7B4_b8Ae6lqm4Cg#q='+ item.Name+ '" target="_blank" md-autofocus><ng-md-icon icon="school"></ng-md-icon>            More on google           </md-button>'+
                                     '<span flex></span>'+
                                     '<md-button ng-click="cancelthis()"><ng-md-icon icon="cancel"></ng-md-icon>                  ביטול            </md-button>'+
                                     '<md-button ng-click="savenew()"><ng-md-icon icon="save"></ng-md-icon>                   שמור            </md-button>'+
                                     '</md-dialog-actions>'+
                                     '</form>'+
                                     '</md-dialog>',                           
                 controller: function DialogController($scope, $mdDialog) {
                              $scope.hide = function() {
                                $mdDialog.hide();
                              };
                              // $scope.cancel = function() {
                              //   $mdDialog.cancel();
                              // };
                              // $scope.answer = function(answer) {
                              //   $mdDialog.hide(answer);
                              // };
                              $scope.save = function(answer) {
                                swal("נשמר", "פרטי הקורס נשמרו!", "success");
                                $mdDialog.hide(answer);
                              };
                              $scope.cancel = function() {
                                swal({   title: "חזרנו!",   text: "",   timer: 1000,   showConfirmButton: false, imageUrl:"http://admissions.colostate.edu/media/sites/19/2014/07/icon_books-011-1024x1024.png"});
                                $mdDialog.hide();
                              };
                               $scope.savenew = function(answer) {
                                swal("נשמר", "פרטי הקורס נשמרו!", "success");
                                $scope.newcoursetoadd = {Name:document.getElementById("cnameinp").value,
                                                         PictureUrl:document.getElementById("cpicurlinp").value,
                                                         CourseCode:document.getElementById("ccoursecodeinp").value,
                                                         Description:document.getElementById("cdescinp").value,
                                                         Syllabus:document.getElementById("csyllinp").value,
                                                         TargetPopulation:document.getElementById("ctatpopinp").value,
                                                         DayTime:document.getElementById("cdtimeinp").value,
                                                         DurationInHours:document.getElementById("cdurationinp").value,
                                                         PassingGrade:document.getElementById("cpassgradeinp").value,
                                                         Price:document.getElementById("cpriceinp").value,
                                                         MinimumPeople:document.getElementById("cminpeopleinp").value,
                                                         MaximumPeople:document.getElementById("cmaxpeopleinp").value,
                                                         Comments:document.getElementById("ccommentsinp").value,
                                                         Category:document.getElementById("ccatgoryinp").value,
                                                         IsMeetup:document.getElementById("cismeetupinp").value};
                                $mdDialog.hide(answer);
                                alert("The course added is: \n" +
                                      document.getElementById("cnameinp").value + "\n" + 
                                      document.getElementById("cpicurlinp").value + "\n" + 
                                      document.getElementById("ccoursecodeinp").value + "\n" + 
                                      document.getElementById("cdescinp").value + "\n" + 
                                      document.getElementById("csyllinp").value + "\n" + 
                                      document.getElementById("ctatpopinp").value + "\n" + 
                                      document.getElementById("cdtimeinp").value + "\n" + 
                                      document.getElementById("cdurationinp").value + "\n" + 
                                      document.getElementById("cpassgradeinp").value + "\n" + 
                                      document.getElementById("cpriceinp").value + "\n" + 
                                      document.getElementById("cminpeopleinp").value + "\n" + 
                                      document.getElementById("cmaxpeopleinp").value + "\n" + 
                                      document.getElementById("ccommentsinp").value + "\n" + 
                                      document.getElementById("ccatgoryinp").value + "\n" + 
                                      document.getElementById("cismeetupinp").value);
                              };
                              // $scope.edit = function(answer) {
                              //   swal({   title: "עריכה!",   text: "<span style='color:#F8BB86'><h3>ברוך הבא למסך העריכה</h3><span>",   html: true });
                              //   $mdDialog.hide(answer);
                              // };
                              $scope.cancelthis = function(answer) {
                                sweetAlert("בוטל", "השינויים בוטלו!", "error");
                                $mdDialog.hide(answer);
                                $scope.showCustom(event, item);
                              };

                            }
               });
            };









     $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'dialog1.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true
    });
    // .then(function(answer) {
    //   $scope.status = 'You said the information was "' + answer + '".';
    // }, function() {
    //   $scope.status = 'You cancelled the dialog.';
    // });
    // $scope.$watch(function() {
    //   return $mdMedia('xs') || $mdMedia('sm');
    // }, function(wantsFullScreen) {
    //   $scope.customFullscreen = (wantsFullScreen === true);
    // });
  };
$scope.allcoursesrealWithRating;
$scope.allcoursesrealWithRatingdivided = [];
var somemagic = [];
var moremagic = [];

 // Gets all courses 
httpService.get("/api/courses").then(function (response){
 $scope.isLoading = false;
 $scope.allcoursesreal = response.data;
 $scope.allcoursesrealWithRating = response.data;
 
    // Gets all ratings 
    httpService.get("/api/ratings/").then(function (response){
    //$scope.isLoading = false;
    $scope.allratings = response.data;
    var ratigfound = false;
      for ( var i = 0; i <  $scope.allcoursesreal.length; i++) {
        ratigfound = false;
        for ( var j = 0; j <  $scope.allratings.length; j++) {
              if ($scope.allcoursesreal[i].CourseCode ==  $scope.allratings[j].courseCode) {
                  $scope.allcoursesrealWithRating[i].rating = response.data[j].rating;
                  ratigfound = true;
// TODO: this makes tooooooooons of http requests
//                   httpService.get("/api/images/"+$scope.allcoursesrealWithRating[i].CourseCode).then(function (response){
//                       $scope.allcoursesrealWithRating[i].imgurlofpic = response.data;
// }                 );
              }
        }
        if (!ratigfound){
          $scope.allcoursesrealWithRating[i].rating = 0;
        }
    }
    });

$scope.countmee = 0;
      for ( var i = 0; i <  $scope.allcoursesrealWithRating.length; i++) {
          somemagic.push($scope.allcoursesrealWithRating[i]); 
          somemagic.push($scope.allcoursesrealWithRating[i+1]);
          somemagic.push($scope.allcoursesrealWithRating[i+2]); 
          moremagic.push(somemagic);
          $scope.allcoursesrealWithRatingdivided.push(somemagic);
          somemagic = [];
          //$scope.allcoursesrealWithRatingdivided.push(',');
          $scope.countmee = $scope.countmee + 1;
          i = i + 2;
    }

    var stophere = 1;

$scope.allcoursesrealWithRatingshlish = [];
$scope.allcoursesrealWithRatingshneishlish = [];
$scope.allcoursesrealWithRatingshlishaharon = [];
var indexfirst = 0;
var indexsecond = 0;
var indexthird = 0;
for ( var i = 0; i <  $scope.allcoursesrealWithRating.length; i++) {
          if (i <= ($scope.allcoursesrealWithRating.length / 3)) {
                $scope.allcoursesrealWithRatingshlish.push($scope.allcoursesrealWithRating[i]);
                indexfirst++;
          }
          else if ((i < (($scope.allcoursesrealWithRating.length / 3)*2)) && (i > ($scope.allcoursesrealWithRating.length / 3))) {
              $scope.allcoursesrealWithRatingshneishlish.push($scope.allcoursesrealWithRating[i]);
                indexsecond++;
          }
          else {
                $scope.allcoursesrealWithRatingshlishaharon.push($scope.allcoursesrealWithRating[i]);
                indexthird++;
          }
    }


});

$scope.convertdate = function(millsecondsstring){
    var millseconds = millsecondsstring.match(/\d/g);
    millseconds = millseconds.join("");
    var theDate = new Date(parseInt(millseconds));
    return (theDate.getDate() + "/" + (theDate.getMonth()+1) + "/" + theDate.getFullYear());
}

$scope.ratingrange = function(number){
return new Array(number);
}

$scope.rowsize = function(){
return new Array(3);
}

httpService.get("/api/images/:courseId").then(function (response){
 //$scope.allcoursesreal = response.data;
});


}]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}