angular.module('marshalApp')
    .service('courseHandler', [CourseHandler])

function CourseHandler() {
    var courses = [
        {
            id: 1,
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
            id: 2,
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
            id: 3,
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
    ];
    
    this.getCourses = function() {
        return courses;
    };
    
    this.addCourse = function(course) {
        courses.push(course);
    };
    
    this.deleteCourse = function(id) {
        courses.forEach(function(course, index) {
            if (course.id === id) {
                courses.splice(index, 1);
                
                return;
            }
        });
    }
    
    this.getCourseTemplate = function() {
        return {
            name: "",
            symbol: "",
            desc: "",
            syl: "",
            duration: "",
            reqs: "",
            destPop: "",
            dep: "",
            price: 0,
            notes: ""
        }
    };
}