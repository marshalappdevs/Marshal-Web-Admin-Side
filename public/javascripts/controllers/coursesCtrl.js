
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

// $scope.addNewCourse = function(event, item) {
//   swal({   title: "הוספה!",   text: "הוספת קורס חדש",   imageUrl:"https://inception-app-prod.s3.amazonaws.com/YmE4ZDY5MmUtNTU4Mi00NGI5LTk2YTMtY2Y4YWQ2MjgwNGZj/content/2016/06/recommend.png" });
//    $mdDialog.show({
//                   clickOutsideToClose: true,
//                   hasBackdrop: false,
//                   targetEvent: event,
//                   scope: $scope,        
//                   preserveScope: true,           
//                   template: '<md-dialog aria-label="item.Name"  ng-cloak class="animated zoomIn">'+
//                             '      <form>'+
//                             '      <md-toolbar>'+
//                             '      <div class="md-toolbar-tools">'+
//                             '        <h2>' +item.Name + '</h2>'+
//                             '        <span flex></span>'+
//                             '        <md-button class="md-icon-button" ng-click="cancel()">'+
//                             '        <md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">'+
//                             '        </md-icon>            X           </md-button>'+
//                             '       </div>'+
//                             '        </md-toolbar>'+
//                             '        <md-dialog-content>'+
//                             '        <div class="md-dialog-content">'+
//                             '        <center><img class="md-card-image-dialog" ng-src="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'" alt="Washed Out">'+
//                             '</center>'+
//                             '        <p>'+
//                             '            <b>סימול:</b>' + item.CourseCode + 
//                             '        </p>'+
//                             '        <p>'+
//                             '            <b>תיאור כללי:</b>' +item.Description + 
//                             '        </p>'+
//                             '        <p>'+
//                             '            <b>סילבוס:</b>' + item.Syllabus + 
//                             '        </p>'+
//                             '        <p>' +
//                             '            <b>אוכלוסיית יעד:</b>' + item.TargetPopulation + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>זמן ביום:</b>' + item.DayTime + 
//                             '        </p>'+
//                             '       <p>'+
//                             '            <b>מספר ימים:</b>' + item.DurationInDays + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>ציון מעבר:</b>' + item.PassingGrade + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>מחיר:</b>' + item.Price + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>מינימום שתתפים:</b>' + item.MinimumPeople + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>מקסימום משתתפים:</b>' + item.MaximumPeople + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>תגובות:</b>' + item.Comments + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>קטגוריה:</b>' + item.Category +       
//                             '</p>'+
//                             '         <p>'+
//                             '            <b>האם מיטאפ:</b>' + item.IsMeetup + 
//                             '        </p>'+
//                             '         <p>'+
//                             '            <b>רשימת מחזורים:</b>' +
//                             '<select>'+
//                                   '<option ng-repeat="course in currcyclelist">{{convertdate(course.StartDate)}}       ->       {{convertdate(course.EndDate)}}</option>'+
//                             '</select>'+
//                             '        </p>'+
//                             '     </div>'+
//                             '        </md-dialog-content>'+
//                             '        <md-dialog-actions layout="row">'+
//                             '        <md-button href="https://www.google.co.il/?gfe_rd=cr&ei=2buVV9j7B4_b8Ae6lqm4Cg#q='+ item.Name+ '" target="_blank" md-autofocus><ng-md-icon icon="school"></ng-md-icon>'+
//                             '            More on google           </md-button>'+
//                             '       <span flex></span>'+
//                             '       <md-button ng-click="cancelthis()"><ng-md-icon icon="cancel"></ng-md-icon>                  ביטול            </md-button>'+
//                             '      <md-button ng-click="save()"><ng-md-icon icon="save"></ng-md-icon>                   שמור            </md-button>'+
//                             '   <md-button ng-click="edit()"><ng-md-icon icon="border_color"></ng-md-icon>    ערוך  </md-button>'+
//                             '   </md-dialog-actions>'+
//                             '      </form>'+
//                             '</md-dialog>',                           
//                  controller: function DialogController($scope, $mdDialog) {
//                               $scope.hide = function(answer) {
//                                 $mdDialog.hide(answer);
//                               };
//                             }
//                });
// }

  // Calculating rating for each course and shows on the card on main course page
  $scope.calcmyrating = function(item) {
      $scope.ratingsofcurrcourse = item.Ratings;
      var sum = 0;
      for (var i = 0; i < $scope.ratingsofcurrcourse.length; i++){
        sum = sum + $scope.ratingsofcurrcourse[i].rating;
      }
    var CalculatedRating = sum/$scope.ratingsofcurrcourse.length;
    return (parseInt(CalculatedRating));
  }


  $scope.showCustom = function(event, item) {
    $scope.ratingsofcurrcourse = item.Ratings;
    $scope.currcyclelist = item.cycleList;
    var sum = 0;
    for (var i = 0; i < $scope.ratingsofcurrcourse.length; i++){
      sum = sum + $scope.ratingsofcurrcourse[i].rating;
    }
    $scope.currCalculatedRating = sum/$scope.ratingsofcurrcourse.length;
    //alert("avg of raitings is: "+ (sum/$scope.ratingsofcurrcourse.length));
               $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  template: '<md-dialog aria-label="item.Name"  ng-cloak class="animated zoomIn">'+
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
                            '<table class="md-table mdl-data-table mdl-js-data-table">'+
                              '<thead>'+
                                '<tr>'+
                                  '<th class="mdl-data-table__cell--non-numeric">Start Date</th>'+
                                  '<th class="mdl-data-table__cell--non-numeric">End Date</th>'+
                                '</tr>'+
                              '</thead>'+
                              '<tbody>'+
                                '<tr ng-repeat="course in currcyclelist">'+
                                  '<td class="mdl-data-table__cell--non-numeric">{{convertdate(course.StartDate)}}</td>'+
                                  '<td class="mdl-data-table__cell--non-numeric">{{convertdate(course.EndDate)}}</td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                            // '<select>'+
                            //       '<option ng-repeat="course in currcyclelist">{{convertdate(course.StartDate)}}       ->       {{convertdate(course.EndDate)}}</option>'+
                            // '</select>'+
                            '        </p>'+
                            '         <p>'+
                            '            <b>רייטינג:</b>' +
                            '<table class="md-table mdl-data-table mdl-js-data-table">'+
                              '<thead>'+
                              '</thead>'+
                              '<tbody>'+
                                '<tr>'+
                                  '<td class="mdl-data-table__cell--non-numeric">{{currCalculatedRating}}</td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                            // '<select>'+
                            //       '<option ng-repeat="course in currcyclelist">{{convertdate(course.StartDate)}}       ->       {{convertdate(course.EndDate)}}</option>'+
                            // '</select>'+
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
 // document.getElementById(stridofcourse).hidden = !(document.getElementById(stridofcourse).hidden);
    
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
                    '<input input-clear="black" id="cnameinp" type="text" name="FirstName" value="'+item.Name+'" input-clear-no-material="blue">'+  
                    '<span flex></span>'+
                    '<md-button class="md-icon-button" ng-click="cancel()">' +        
                    '<md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">' + 
                    '</md-icon>            X           </md-button>'+
                    '</div>'+
                    '</md-toolbar>'+
                    '<md-dialog-content>'+
                    '<div class="md-dialog-content">'+
                    '<center><img class="md-card-image-dialog" ng-src="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'" alt="Washed Out"></center>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">URL של תמונת הקורס</label>'+
                    '<input id="cpicurlinp" value="http://marshalweb.azurewebsites.net/api/images/'+item.CourseCode+'">'+
        	          '</md-input-container>'+
                    '<p>'+
                     '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">סימול:</label>'+
                    '<input id="ccoursecodeinp" value="'+item.CourseCode+'">'+
        	          '</md-input-container>'+
                    '</p>'+
                    '<p>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">תיאור כללי:</label>'+
                    '<input id="cdescinp" value="'+item.Description+'">'+
        	          '</md-input-container>'+  
                      '</p>'+
                    '<p>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">סילבוס:</label>'+
                    '<input id="csyllinp" value="'+ item.Syllabus +'">'+
        	          '</md-input-container>'+  
                      '        </p>'+
                      '<p>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                      '<label class="boldwords">אוכלוסיית יעד:</label>'+
                      '<input id="ctatpopinp" value="'+item.TargetPopulation+'">'+
                      '</md-input-container>'+ 
                      '        </p>'+
                      '<p>'+
                        '<br><md-input-container class="md-block" flex-gt-sm>'+
                        '<label class="boldwords">זמן ביום:</label>'+
                        '<input id="cdtimeinp" value="'+item.DayTime+'">'+
                        '</md-input-container>'+ 
                        '        </p>'+
                        '<p>'+
                        '<br><md-input-container class="md-block" flex-gt-sm>'+
                        '<label class="boldwords">מספר ימים:</label>'+
                        '<input id="cdurationinp" value="'+ item.DurationInDays +'">'+
                        '</md-input-container>'+  
                        '        </p>'+
                        '<p>'+
                           '<br><md-input-container class="md-block" flex-gt-sm>'+
                        '<label class="boldwords">ציון מעבר:</label>'+
                        '<input id="cpassgradeinp" value="'+ item.PassingGrade +'">'+
                        '</md-input-container>'+  
                          '        </p>'+
                          '<p>'+
                          '<br><md-input-container class="md-block" flex-gt-sm>'+
                          '<label class="boldwords">מחיר:</label>'+
                          '<input id="cpriceinp" value="'+ item.Price +'">'+
                          '</md-input-container>'+  
                          '        </p>'+
                          '<p>'+
                            '<br><md-input-container class="md-block" flex-gt-sm>'+
                            '<label class="boldwords">מינימום שתתפים:</label>'+
                            '<input id="cminpeopleinp" value="'+ item.MinimumPeople +'">'+
                            '</md-input-container>'+ 
                            '        </p>'+
                            '<p>'+
                            '<br><md-input-container class="md-block" flex-gt-sm>'+
                            '<label class="boldwords">מקסימום משתתפים:</label>'+
                            '<input id="cmaxpeopleinp" value="'+ item.MaximumPeople +'">'+
                            '</md-input-container>'+ 
                            '        </p>'+
                            '<p>'+
                              '<br><md-input-container class="md-block" flex-gt-sm>'+
                              '<label class="boldwords">תגובות:</label>'+
                              '<input id="ccommentsinp" value="'+ item.Comments +'">'+
                              '</md-input-container>'+  
                              '        </p>'+
                              '<p>'+
                              '<br>'+   
                              '<md-input-container style="margin-right: 10px;">'+
                              '<label class="boldwords">קטגוריה:</label>'+
                              '<md-select ng-model="categoryofeditcourse" id="ccatgoryinp" value="'+ item.Category +'">'+
                              '<md-option ng-repeat="category in categories" value="{{category}}">{{category}}</md-option>'+
                              '</md-select>'+
                              '</md-input-container>'+  
                              '</p>'+
                              '<p>'+
                              '<md-input-container style="margin-right: 10px;">'+
                              '<label class="boldwords">האם מיטאפ:</label>'+
                              '<md-select ng-model="meetuprnotedit" id="cismeetupinp" value="'+ item.IsMeetup +'">'+
                              '<md-option value="true">כן</md-option>'+
                              '<md-option value="false">לא</md-option>'+
                              '</md-select>'+
                              '</md-input-container>'+ 
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
                                                  Category:$scope.categoryofeditcourse,
                                                  IsMeetup:$scope.meetuprnotedit};
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
                              $scope.categoryofeditcourse + "\n" + 
                              $scope.meetuprnotedit);
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

$scope.categories = [
          "Tools",
          "Software",
          "Cyber",
          "IT",
          "System"
      ];

  $scope.truevar = true;
  $scope.falsevar = false;    

// Deletes the course from the db
$scope.deletecoursefromdb = function(event, item) {
  // httpService.delete('/api/courses/:'+item._id, item._id).then(function (response){
  //                         alert("WHOOOOOHOOOOOOO!!!!!");
  //                       });
    alert("You deleted the course! the id of the course is: " +item._id);
} 

$scope.addNewCourse = function(event) {
  swal({   title: "הוספה!",   text: "הוספת קורס חדש",   imageUrl:"https://inception-app-prod.s3.amazonaws.com/YmE4ZDY5MmUtNTU4Mi00NGI5LTk2YTMtY2Y4YWQ2MjgwNGZj/content/2016/06/recommend.png" });
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,        
          preserveScope: true,           
          template: '<md-dialog aria-label="item.Name"  ng-cloak>'+
                    '<form>'      +
                    '<md-toolbar>'    +    
                    '<div class="md-toolbar-tools">'  +      
                    '<h2>שם הקורס:</h2>'+
                    '<input input-clear="black" id="cnameinp" type="text" name="FirstName" value="">'+  
                    '<md-button class="md-icon-button" ng-click="cancel()">' +        
                    '<md-iconmd-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog">' + 
                    '</md-icon>            X           </md-button>'+
                    '</div>'+
                    '</md-toolbar>'+
                    '<md-dialog-content>'+
                    '<div class="md-dialog-content">'+
                    '<center><img class="md-card-image-dialog" ng-src="{{urlOfPicToAdd}}" alt="הכנס URL של התמונה"></center>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">URL של תמונת הקורס</label>'+
                    '<input id="cpicurlinp" ng-model="urlOfPicToAdd">'+
        	          '</md-input-container>'+
                    '<p>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">סימול:</label>'+
                    '<input id="ccoursecodeinp">'+
        	          '</md-input-container>'+ 
                    '</p>'+
                    '<p>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">תיאור כללי:</label>'+
                    '<input id="cdescinp">'+
        	          '</md-input-container>'+  
                      '</p>'+
                    '<p>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">סילבוס:</label>'+
                    '<input id="csyllinp">'+
        	          '</md-input-container>'+  
                      '        </p>'+
                      '<p>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">אוכלוסיית יעד:</label>'+
                    '<input id="ctatpopinp">'+
        	          '</md-input-container>'+  
                      '        </p>'+
                      '<p>'+
                      '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">זמן ביום:</label>'+
                    '<input id="cdtimeinp">'+
        	          '</md-input-container>'+  
                        '        </p>'+
                      '<p>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">מספר ימים:</label>'+
                    '<input id="cdurationinp">'+
        	          '</md-input-container>'+  
                        '        </p>'+
                        '<p>'+
                          '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">ציון מעבר:</label>'+
                    '<input id="cpassgradeinp">'+
        	          '</md-input-container>'+   
                          '        </p>'+
                          '<p>'+
                          '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">מחיר:</label>'+
                    '<input id="cpriceinp">'+
        	          '</md-input-container>'+  
                          '        </p>'+
                          '<p>'+
                            '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">מינימום שתתפים:</label>'+
                    '<input id="cminpeopleinp">'+
        	          '</md-input-container>'+  
                            '        </p>'+
                            '<p>'+
                            '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">מקסימום משתתפים:</label>'+
                    '<input id="cmaxpeopleinp">'+
        	          '</md-input-container>'+  
                            '        </p>'+
                            '<p>'+
                              '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">תגובות:</label>'+
                    '<input id="ccommentsinp">'+
        	          '</md-input-container>'+  
                              '        </p>'+
                              '<p>'+
                    '<md-input-container style="margin-right: 10px;">'+
                    '<label class="boldwords">קטגוריה:</label>'+
                    '<md-select ng-model="categoryofcourse" id="ccatgoryinp">'+
                    '<md-option ng-repeat="category in categories" value="{{category}}">{{category}}</md-option>'+
                    '</md-select>'+
                    '</md-input-container>'+   
                    '</p>'+
                    '<p>'+
                    '<br>'+ 
                    '<md-input-container style="margin-right: 10px;">'+
                    '<label class="boldwords">האם מיטאפ:</label>'+
                    '<md-select ng-model="meetuprnot" id="cismeetupinp">'+
                    '<md-option value="{{truevar}}">כן</md-option>'+
                    '<md-option value="{{falsevar}}" selected="selected">לא</md-option>'+
                    '</md-select>'+
                    '</md-input-container>'+ 
                              '        </p>'+
                              '</div>'+
                              '</md-dialog-content>'+
                              '<md-dialog-actions layout="row">'+
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

                        $scope.canIsave = true;

                        //swal("נשמר", "פרטי הקורס נשמרו!", "success");
                        $scope.coursecodevalue = document.getElementById("ccoursecodeinp").value;                                          
                        
                        // Check if course code input is valid
                        if((isNaN(document.getElementById("ccoursecodeinp").value) || ($scope.coursecodevalue == null) || ($scope.coursecodevalue == ""))){
                            //alert("Course code is not valid! Please enter a number...");
                            $scope.canIsave = false;
                            swal("שגיאה!", "סימול הקורס לא תקין, אנא הכנס מספר", "error");
                        }

                        $scope.cdurationinp = document.getElementById("cdurationinp").value;
                        // Check if duration in days input is valid
                        if ((isNaN(document.getElementById("cdurationinp").value) || ($scope.cdurationinp == null) || ($scope.cdurationinp == ""))){
                            $scope.canIsave = false;
                            swal("שגיאה!", "משך הקורס בימים לא תקין, אנא הכנס מספר", "error");
                        }

                        $scope.cpassgradeinp = document.getElementById("cpassgradeinp").value;
                        var grade = parseInt(document.getElementById("cpassgradeinp").value);
                        // Check if passig grade input is valid
                        if (((isNaN(document.getElementById("cpassgradeinp").value) || ($scope.cpassgradeinp == null) || ($scope.cpassgradeinp == "")) ||
                            (grade > 100) || (grade < 0))){
                            $scope.canIsave = false;
                            swal("שגיאה!", "ציון המעבר של הקורס לא תקין, אנא הכנס מספר בין 0 ל-100", "error");
                        }

                        

                        // else{
                        //     alert("ok...");                          
                        // }
                        if ($scope.canIsave){
                            $scope.addnewnow = {Name:document.getElementById("cnameinp").value,
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
                                                  Category:$scope.categoryofcourse,
                                                  IsMeetup:$scope.meetuprnot};
                        httpService.post('/api/courses', $scope.addnewnow).then(function (response){
                          alert("WHOOOOOHOOOOOOO!!!!!");
                        });
                        //$mdDialog.hide(answer);
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
                              $scope.categoryofcourse + "\n" + 
                              $scope.meetuprnot);
                        }
                        
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

// angular.module('marshalApp').directive('inputClear', inputClear)
//         .directive('inputClearNoMaterial', inputClearNoMaterial);

//         function inputClear() {
//         return {
//             restrict: 'A',
//             compile: function (element, attrs) {
//                 var color = attrs.inputClear;
//                 var style = color ? "color:" + color + ";" : "";
//                 var action = attrs.ngModel + " = ''";
//                 element.after(
//                     '<md-button class="animate-show md-icon-button md-accent"' +
//                     'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
//                     'style="position: absolute; top: 0px; left: -1px; margin: 13px 0px;">' +
//                     '<div style="' + style + '">x</div>' +
//                     '</md-button>');
//             }
//         };
//     }
    
//     function inputClearNoMaterial() {
//         return {
//             restrict: 'A',
//             compile: function (element, attrs) {
//                 var color = attrs.inputClearNoMaterial;
//                 var style = color ? "color:" + color + ";" : "";
//                 var action = attrs.ngModel + " = ''";
//                 element.after(
//                     '<span class="animate-show"' +
//                     'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
//                     'style="position: absolute; margin: 3px -20px; cursor: pointer;">' +
//                     '<div style="' + style + '">x</div>' +
//                     '</span>');
//             }
//         };
//     }