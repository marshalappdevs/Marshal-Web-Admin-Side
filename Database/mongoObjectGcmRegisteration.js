var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var GcmRegisterationSchema = mongoose.Schema(require('./Models/GcmRegisterationSchema'));
    var regisrations = mongoose.model('GcmRegisterations', GcmRegisterationSchema);
    deferred.resolve(regisrations);
});

module.exports = deferred.promise;