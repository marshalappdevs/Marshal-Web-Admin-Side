
angular.module('marshalApp')
.controller('coursesCtrl', ['$scope','$mdDialog','$mdMedia','httpService', '$location', function($scope,$mdDialog, $mdMedia,httpService, $location){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "קורסים והשתלמויות");

    $scope.currCourse;

    $scope.onCourseChoosen = function(item){
        $scope.currCourse = item;
    }

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

  $scope.chooseAddMethod = function (ev) {
        var confirm = $mdDialog.confirm()
          .title('איך תרצה להוסיף קורס?')
          .textContent('מקבצים קיימים או ידנית?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('מקבצים!')
          .cancel('ידנית');

    $mdDialog.show(confirm).then(function() {
      $location.path("/courses/upload");
    }, function() {
      $scope.addNewCourse(ev);
    });
  }

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
                            '        <center><img class="md-card-image-dialog" ng-src="http://marshalweb.azurewebsites.net/api/courses/images/'+item.CourseCode+'" alt="Washed Out">'+
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
                            '        <p>'+
                            '            <b>מספר ימים:</b>' + item.DurationInDays + 
                            '        </p>'+
                            '        <p>'+
                            '            <b>מספר שעות:</b>' + item.DurationInHours + 
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
                            '            <b>האם מיטאפ:</b>' + item.ismooc + 
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
                                  swal("נשמר", "פרטי הקורס נשמרו!", "success");

                                  $scope.updatecourse = {Name:document.getElementById("cnameinp").value,
                                                            imageUrl:document.getElementById("cpicurlinp").value,
                                                            CourseCode:document.getElementById("ccoursecodeinp").value,
                                                            Description:document.getElementById("cdescinp").value,
                                                            Syllabus:document.getElementById("csyllinp").value,
                                                            TargetPopulation:document.getElementById("ctatpopinp").value,
                                                            DayTime:document.getElementById("cdtimeinp").value,
                                                            DurationInDays:document.getElementById("cdurationindays").value,
                                                            DurationInHours:document.getElementById("cdurationinhours").value,
                                                            PassingGrade:document.getElementById("cpassgradeinp").value,
                                                            Price:document.getElementById("cpriceinp").value,
                                                            MinimumPeople:document.getElementById("cminpeopleinp").value,
                                                            MaximumPeople:document.getElementById("cmaxpeopleinp").value,
                                                            Comments:document.getElementById("ccommentsinp").value,
                                                            Category:$scope.categoryofcourse.toLowerCase(),
                                                            IsMeetup:$scope.meetuprnot,
                                                            IsMooc:$scope.ismooc};
                                  httpService.put('/api/courses', $scope.updatecourse).then(function (response){
                                    alert(response);
                                    $mdDialog.hide(answer);
                                  });
                                
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
  httpService.delete('/api/courses/'+item.CourseCode).then(function (response){
     $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('הקורס נמחק בהצלחה')
              .textContent('')
              .ariaLabel('Success')
              .ok('יש!')
              .targetEvent(null)
        );
  });
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
                    '<input ng-model="savename" input-clear="black" id="cnameinp" type="text" name="FirstName" value="">'+  
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
                    '<input id="cdurationindays">'+
        	          '</md-input-container>'+  
                        '        </p>'+
                        '<p>'+
                    '<br><md-input-container class="md-block" flex-gt-sm>'+
                    '<label class="boldwords">מספר בשעות:</label>'+
                    '<input id="cdurationinhours">'+
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
                              '<p>'+
                    '<br>'+ 
                    '<md-input-container style="margin-right: 10px;">'+
                    '<label class="boldwords">האם רשתי:</label>'+
                    '<md-select ng-model="ismooc" id="cismeetupinp">'+
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

                      $scope.save = function(answer) {
                        swal("נשמר", "פרטי הקורס נשמרו!", "success");

                        $scope.updatecourse = {Name:document.getElementById("cnameinp").value,
                                                  imageUrl:document.getElementById("cpicurlinp").value,
                                                  CourseCode:document.getElementById("ccoursecodeinp").value,
                                                  Description:document.getElementById("cdescinp").value,
                                                  Syllabus:document.getElementById("csyllinp").value,
                                                  TargetPopulation:document.getElementById("ctatpopinp").value,
                                                  DayTime:document.getElementById("cdtimeinp").value,
                                                  DurationInDays:document.getElementById("cdurationindays").value,
                                                  DurationInHours:document.getElementById("cdurationinhours").value,
                                                  PassingGrade:document.getElementById("cpassgradeinp").value,
                                                  Price:document.getElementById("cpriceinp").value,
                                                  MinimumPeople:document.getElementById("cminpeopleinp").value,
                                                  MaximumPeople:document.getElementById("cmaxpeopleinp").value,
                                                  Comments:document.getElementById("ccommentsinp").value,
                                                  Category:$scope.categoryofcourse.toLowerCase(),
                                                  IsMeetup:$scope.meetuprnot,
                                                  IsMooc:$scope.ismooc};
                        httpService.post('/api/courses', $scope.updatecourse).then(function (response){
                          alert(response);
                          $mdDialog.hide(answer);
                        });
                      
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

                        $scope.cdurationindays = document.getElementById("cdurationindays").value;
                        // Check if duration in days input is valid
                        if ((isNaN(document.getElementById("cdurationindays").value) || ($scope.cdurationindays == null) || ($scope.cdurationindays == ""))){
                            $scope.canIsave = false;
                            swal("שגיאה!", "משך הקורס בימים לא תקין, אנא הכנס מספר", "error");
                        }

                        $scope.cdurationinhours = document.getElementById("cdurationinhours").value;
                        // Check if duration in hours input is valid
                        if ((isNaN(document.getElementById("cdurationinhours").value) || ($scope.cdurationinhours == null) || ($scope.cdurationinhours == ""))){
                            $scope.canIsave = false;
                            swal("שגיאה!", "משך הקורס בשעות לא תקין, אנא הכנס מספר", "error");
                        }

                        $scope.cpassgradeinp = document.getElementById("cpassgradeinp").value;
                        var grade = parseInt(document.getElementById("cpassgradeinp").value);
                        // Check if passig grade input is valid
                        if (((isNaN(document.getElementById("cpassgradeinp").value) || ($scope.cpassgradeinp == null) || ($scope.cpassgradeinp == "")) ||
                            (grade > 100) || (grade < 0))){
                            $scope.canIsave = false;
                            swal("שגיאה!", "ציון המעבר של הקורס לא תקין, אנא הכנס מספר בין 0 ל-100", "error");
                        }

                        if ($scope.canIsave){
                            $scope.addnewnow = {Name:document.getElementById("cnameinp").value,
                                                  imageUrl:document.getElementById("cpicurlinp").value,
                                                  CourseCode:document.getElementById("ccoursecodeinp").value,
                                                  Description:document.getElementById("cdescinp").value,
                                                  Syllabus:document.getElementById("csyllinp").value,
                                                  TargetPopulation:document.getElementById("ctatpopinp").value,
                                                  DayTime:document.getElementById("cdtimeinp").value,
                                                  DurationInDays:document.getElementById("cdurationindays").value,
                                                  DurationInHours:document.getElementById("cdurationinhours").value,
                                                  PassingGrade:document.getElementById("cpassgradeinp").value,
                                                  Price:document.getElementById("cpriceinp").value,
                                                  MinimumPeople:document.getElementById("cminpeopleinp").value,
                                                  MaximumPeople:document.getElementById("cmaxpeopleinp").value,
                                                  Comments:document.getElementById("ccommentsinp").value,
                                                  Category:$scope.categoryofcourse.toLowerCase(),
                                                  IsMeetup:$scope.meetuprnot,
                                                  IsMooc:$scope.ismooc};
                        httpService.post('/api/courses/', $scope.addnewnow).then(function (response){
                          alert("WHOOOOOHOOOOOOO!!!!!");
                        });
                        
                        }
                        
                      };

                      $scope.cancelthis = function(answer) {
                        sweetAlert("בוטל", "השינויים בוטלו!", "error");
                        $mdDialog.hide(answer);
                        $scope.showCustom(event, item);
                      };

                    }
        });
        };


 // Gets all courses 
httpService.get("/api/courses").then(function (response){
 $scope.isLoading = false;
 $scope.allcoursesreal = response.data;


});

$scope.rowsize = function(){
return new Array(3);
}

}]).
controller('courseEditCtrl', ['$scope','$mdDialog','$mdMedia','httpService', '$location', '$routeParams', function($scope,$mdDialog, $mdMedia,httpService, $location, $routeParams){
  $scope.isLoading = true;

  /**
   * Get current course details
   */
  httpService.get("/api/courses/"+ $routeParams.id).then(function (response) {
    $scope.isLoading = false;
    $scope.currCourse = response.data;
  });

  /**
   * Parsing shitty Marshal date into JS object
   */
  $scope.parseDate = function(dateString) {
    if(dateString){
      return new Date(parseInt(dateString.replace('/Date(', '')));
    } else {
      return undefined;
    }   
  } 

  /**
   * Formatting JS object to the shitty Marshal format
   */
  $scope.formatDate = function(date) {
    if(date instanceof Date) {
      return "/Date("+date.valueOf()+")/"
    } else {
      return date;
    }
  }

  /**
   * Adding a fictive cycle to a given cycle list
   */
  $scope.addCycle = function(cycles){
      var currcoursenew = {"ID":cycles[cycles.length-1].ID+1,
                           "Name":$scope.currCourse.Name,
                           "MaximumPeople":0,
                           "Description":$scope.currCourse.Description,
                           "StartDate":null,
                           "EndDate":null};
      cycles.push(currcoursenew);
  };

  /**
   * Update in DB
   */
  $scope.updateCourse = function() {
    angular.forEach($scope.currCourse.cycleList, function(currCycle) {
      currCycle.StartDate = $scope.formatDate(currCycle.StartDate);
      currCycle.EndDate = $scope.formatDate(currCycle.EndDate);
    }, this);


    /**
     * Redirecting on success, staying in the same page on error
     */
    httpService.put("/api/courses/"+ $routeParams.id, $scope.currCourse)
    .then(function(res) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('הקורס עודכן בהצלחה')
              .textContent('')
              .ariaLabel('Success')
              .ok('יש!')
              .targetEvent(null)
        )
        .then(function() {
          $location.path('/courses');
        });
    }, function(err) {
       $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('לא הצלחנו לעדכן את הקורס')
              .textContent('')
              .ariaLabel('Success')
              .ok('באסה')
              .targetEvent(null)
        );
    })
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
