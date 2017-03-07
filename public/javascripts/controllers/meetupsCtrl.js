angular.module('marshalApp')
.controller('meetupsCtrl', ['$scope','httpService','$mdMedia','$mdDialog','$location', function($scope, httpService, $mdMedia, $mdDialog, $location){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מיטאפים");

    $scope.isLoading = true;

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

  $scope.chooseAddMethod = function (ev) {
        var confirm = $mdDialog.confirm()
          .title('איך תרצה להוסיף מיטאפ?')
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
                .title('המיטאפ נמחק בהצלחה')
                .textContent('')
                .ariaLabel('Success')
                .ok('יש!')
                .targetEvent(null)
            );
    });
    } 

    $scope.allMeetups = [];
    // Gets all courses 
    httpService.get("/api/courses").then(function (response){
        $scope.isLoading = false;
        $scope.allcoursesreal = response.data;
            $scope.allcoursesreal.forEach(function(element, index){
                if(element.IsMeetup){
                    //alert(element.Name + "my index is:" + index);
                    $scope.allMeetups.push(element);
                }
                
            });
    });

}]);