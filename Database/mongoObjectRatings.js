var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var ratingsSchema = mongoose.Schema(require('./Models/RatingSchema'));
    var ratings = mongoose.model('ratings', ratingsSchema);
    deferred.resolve(ratings);
});

module.exports = deferred.promise;