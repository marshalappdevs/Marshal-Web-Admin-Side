angular.module('marshalApp')
.controller('meetupsCtrl', ['$scope','httpService', function($scope, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "מיטאפים");

    httpService.get('/api/courses/meetups').then((res) => {
        $scope.meetup = res.data[0];
        httpService.delete('/api/courses/'+ $scope.meetup.CourseCode).then((res) => {
            $scope.meetup.meetupCode = $scope.meetup.CourseCode;
            $scope.meetup.CourseCode = undefined;
            $scope.meetup.IsMooc = undefined;
            $scope.meetup.IsMeetup = undefined;
            $scope.meetup.imageUrl = "https://thumbs.dreamstime.com/t/big-data-word-cloud-related-tags-51595420.jpg";
            httpService.post('/api/meetups', $scope.meetup).then((res) => {
                console.log("Yay!");
            })
        })
    })
}]);
