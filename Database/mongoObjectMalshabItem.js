var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var malshabItemSchema = mongoose.Schema(require('./Models/MalshabItemSchema'));
    var malshabItems = mongoose.model('malshabItems', malshabItemSchema);
    deferred.resolve(malshabItems);
});

module.exports = deferred.promise;