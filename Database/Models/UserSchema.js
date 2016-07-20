var mongoose = require('mongoose');
var crypto = require('crypto');

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
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');
        next();
    }
    else
    {
        return next();
    }
});

UserSchema.methods.comparePass = function(pw, cb) {
    console.log(pw);
    pw = crypto.createHash('sha256').update(pw).digest('hex');
    if(pw == this.password)
    {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

module.exports = mongoose.model('User', UserSchema);
