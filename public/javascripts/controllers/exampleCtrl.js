angular.module('marshalApp')
.controller('ExampleCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog){
    $scope.activity = [
      {
        what: 'לתכנת את הדרעק הזה',
        who: 'איתמר',
        when: '3:08PM',
        notes: " לא נוגע בצד לקוח יותר בחיים!"
      },
      {
         what: 'לתכנת את הדרעק הזה',
        who: 'פיתמר',
        when: '3:08PM',
        notes: " לא נוגע בצד לקוח יותר בחיים!"
      },
      {
       what: 'לתכנת את הדרעק הזה',
        who: 'איתמר',
        when: '3:08PM',
        notes: " סתם בדיקה!"
      },
      {
         what: 'לתכנת את הדרעק הזה',
        who: 'איתמר',
        when: '9:08PM',
        notes: " לא נוגע בצד לקוח יותר בחיים!"
      },
      {
           what: 'לתכנת את הדרעק הזה',
        who: 'איתמר',
        when: '3:08PM',
        notes: " לא נוגע בצד לקוח יותר בחיים!"
      },
    ];
}]);

