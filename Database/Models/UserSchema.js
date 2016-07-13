var mongoose = require('mongoose');
var sha = require('sha.js');
var sha256 = sha('sha256');

// User schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Client', 'Admin'],
        default: 'Client'
    }
});

// Hash user password
UserSchema.pre('save', function(next){
    var user = this;
    if(this.isModified('password') || this.isNew) {
        this.password = sha256.update(this.password, 'utf8').digest('hex');
        next();
    }
    else
    {
        return next();
    }
});

UserSchema.methods.comparePass = function(pw, cb) {
    pw = sha256.update(pw, 'utf8').digest('hex');
    console.log(this.password);
    if(pw == this.password)
    {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

module.exports = mongoose.model('User', UserSchema);