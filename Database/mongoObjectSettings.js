var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var settingsSchema = mongoose.Schema(require('./Models/SettingsSchema'));
    var settings = mongoose.model('Settings', settingsSchema);
    deferred.resolve(settings);
});

module.exports = deferred.promise;