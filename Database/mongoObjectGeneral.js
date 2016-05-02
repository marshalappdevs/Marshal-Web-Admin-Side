var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    // var coursesSchema = mongoose.Schema(require('./Models/CourseSchema'));
    // var courses = mongoose.model('Courses', coursesSchema);
    // deferred.resolve(courses);
    deferred.resolve();
});

// module.exports = deferred.promise;

module.exports = function(collectionType) {
    deferred.promise.then(function() {
        switch (collectionType) {
            case "courses":
                return mongoose.model('courses', coursesSchema);
            case "materials":
                return mongoose.model('materials', coursesSchema);
        }
    })
};