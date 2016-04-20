angular.module('marshalApp')
    .service('courseHandler', ['$http', CourseHandler]);

function CourseHandler($http) {
    var courses = [ ];
    
    this.getCourses = function() {
        $http.get('api/courses')
        .then(function (results) {
            results.data.forEach(x => courses.push(x));
        })
        
        return courses;
    };
    
    this.addCourse = function(course) {
        $http.post('api/courses', course)
        .then(function(result) {
            if (result.data.code === 201) {
                courses.push(course);
                console.log(result.data.message);
            } else {
                console.log(result.data.message);
            }
        });
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
    
    this.updateCourse = function(course) {
        $http.put('api/courses', course)
        .then(function(results) {
            if (results.error) {
                console.log (error);
            }
        });
    }
}