var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../Database/Models/UserSchema');
var config = require('./main');

// Setup work and export for the JWT passport strategy
// Finding and verifying the JWT given.
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
  opts.secretOrKey = config.loginSecret;
  passport.use('jwtLogin', new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({username: jwt_payload.username}, function(err, user) {
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
