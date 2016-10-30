var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../Database/Models/UserSchema');
var config = require('./main');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.loginSecret;
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({username: jwt_payload.sub}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
