var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../Database/Models/UserSchema');
var config = require('./main');

// Setup work and export for the JWT passport strategy
// Finding and verifying the JWT given.
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use('jwtAdmin', new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._doc._id}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user.role == "Admin") {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
