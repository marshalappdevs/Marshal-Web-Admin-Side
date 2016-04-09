angular.module('marshalApp')
    .service('courseHandler', [CourseHandler]);

function CourseHandler() {
    var courses = [
        {
            ID: 1,
            Name: "Design Patterns",
            CourseCode: "6813",
            Description: "ההשתלמות מלמדת טכניקות Design ע\"פ תבניות קבועות ידועות מראש, כולל דרכי השימוש בהם בקוד והרצאת העשרה בנושא REST.",
            Syllabus: "מבוא ל-Design Patterns<br>Singleton<br>Iterator<br>Framework<br>Factory<br>Template<br>MVC<br>Observer<br>Decorator",
            DurationInDays: "5 ימים",
            TargetPopulation: "תכניתנים ואקדמאים בוגרי מדעי המחשב/הנדסת תכונה/הנדסת מערכות מידע",
            ProfessionalDomain: "עוצמה",
            Price: 1455,
            Comments: "יש לבצע מבחן כניסה להשתלמות"
        },
        {
            ID: 3,
            Name: "פיתוח Front End",
            CourseCode: "2633",
            Description: "עקרונות בניית אפליקציות WEB דינאמיות תוך שימוש ביכולות השונות של השפות HTML וJavascript וספריות JQuery וBootstrap.",
            Syllabus: "מבוא ל-HTML<br>Forms<br>HTML5 Forms<br>מבוא ל-Javascript<br>ECMAScript6",
            DurationInDays: "5 ימים",
            TargetPopulation: "תכניתנים, מגן בסייבר, כותב לומדה, נתמ\"מ",
            ProfessionalDomain: "היל\"ה",
            Price: 993,
            Comments: "",
            PictureUrl: "https://rogteran.files.wordpress.com/2015/06/js.png"
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
            if (course.ID === id) {
                courses.splice(index, 1);
                
                return;
            }
        });
    }
    
    this.getCourseTemplate = function() {
        return {
            Name: "",
            CourseCode: "",
            Description: "",
            Syllabus: "",
            DurationInDays: "",
            TargetPopulation: "",
            ProfessionalDomain: "",
            Price: 0,
            Comments: "",
            PictureUrl: ""
        }
    };
}