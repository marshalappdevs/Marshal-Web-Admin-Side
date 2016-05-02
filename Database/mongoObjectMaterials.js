var q = require('q');
var mongoose = require('mongoose');
var deferred = q.defer();
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB!");
    var materialsSchema = mongoose.Schema(require('./Models/MaterialSchema'));
    var materials = mongoose.model('materials', materialsSchema);
    deferred.resolve(materials);
});

module.exports = deferred.promise;