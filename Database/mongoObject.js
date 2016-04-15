var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var coursesSchema = mongoose.Schema(require('./Models/CourseSchema'));
    var courses = mongoose.model('Courses', coursesSchema);
    deferred.resolve(courses);
});

module.exports = deferred.promise;