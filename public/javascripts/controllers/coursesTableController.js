var tempJson = [
    {
        name: "Design Patterns",
        symbol: "6813",
        desc: "ההשתלמות מלמדת טכניקות Design ע\"פ תבניות קבועות ידועות מראש, כולל דרכי השימוש בהם בקוד והרצאת העשרה בנושא REST.",
        syl: "מבוא ל-Design Patterns<br>Singleton<br>Iterator<br>Framework<br>Factory<br>Template<br>MVC<br>Observer<br>Decorator",
        duration: "5 ימים",
        reqs: "לחייל יש מקצוע תכניתן או השכלת אקדמאי מוסמך וגם בעל סיווג שמור, בעל פז\"מ שנה, יתרת שירות חצי שנה ועשה מבחן כניסה על OOP.",
        destPop: "תכניתנים ואקדמאים בוגרי מדעי המחשב/הנדסת תכונה/הנדסת מערכות מידע",
        dep: "עוצמה",
        price: 1455,
        notes: "יש לבצע מבחן כניסה להשתלמות"
    },
    {
        name: "פיתוח Front End",
        symbol: "2633",
        desc: "עקרונות בניית אפליקציות WEB דינאמיות תוך שימוש ביכולות השונות של השפות HTML וJavascript וספריות JQuery וBootstrap.",
        syl: "מבוא ל-HTML<br>Forms<br>HTML5 Forms<br>מבוא ל-Javascript<br>ECMAScript6",
        duration: "5 ימים",
        reqs: "לחייל יש מקצוע כותב לומדה, נתמ\"מ, מגן בסייבר או תכניתן",
        destPop: "תכניתנים, מגן בסייבר, כותב לומדה, נתמ\"מ",
        dep: "היל\"ה",
        price: 993,
        notes: ""
    },
    {
        name: "Design Patterns",
        symbol: "6813",
        desc: "ההשתלמות מלמדת טכניקות Design ע\"פ תבניות קבועות ידועות מראש, כולל דרכי השימוש בהם בקוד והרצאת העשרה בנושא REST.",
        syl: "מבוא ל-Design Patterns<br>Singleton<br>Iterator<br>Framework<br>Factory<br>Template<br>MVC<br>Observer<br>Decorator",
        duration: "5 ימים",
        reqs: "לחייל יש מקצוע תכניתן או השכלת אקדמאי מוסמך וגם בעל סיווג שמור, בעל פז\"מ שנה, יתרת שירות חצי שנה ועשה מבחן כניסה על OOP.",
        destPop: "תכניתנים ואקדמאים בוגרי מדעי המחשב/הנדסת תכונה/הנדסת מערכות מידע",
        dep: "עוצמה",
        price: 1455,
        notes: "יש לבצע מבחן כניסה להשתלמות"
    }
]

angular.module('marshalApp')
    .controller('coursesCtrl', ['$scope', '$uibModal', 'selectedCourse', function($scope, $uibModal, selectedCourse) {
        $scope.courses = tempJson;

        $scope.buildCourseObj = function(name, desc, price) {
            return { name: name, desc: desc, price: price };
        };

        $scope.addCourse = function(course, event) {
            if (event.keyCode === 13) {
                $scope.courses.push(course);
                $scope.newName = "";
                $scope.newDesc = "";
                $scope.newPrice = "";
            }
        };
        
        $scope.open = function(selected) {
            selectedCourse.course = selected;
            $uibModal.open(
                {
                    animation: true,
                    templateUrl: 'courseDialog',
                    controller: 'courseModalCtrl',
                }
            );
        };
    }]);