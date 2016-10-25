'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var User = require('../Database/Models/UserSchema');
var bouncer =  require ('express-bouncer')(25000, 1000000, 3);
var crypto = require('crypto');
var emitter = require('../config/emitter');
var setLastUpdateNow = require('./utility');


// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});

// Routing
router.use('/api/courses', require('./courses'));
router.use('/api/materials', require('./materials'));
router.use('/api/malshabitems', require('./malshabs'));
router.use('/api/ratings', require('./ratings'));
router.use('/api/fcm', require('./fcm'));
router.use('/api/settings', require('./settings'));


// DB connection
mongoose.connect(config.database);

// Adding localhost on the bruteforce whitelist
bouncer.whitelist.push('127.0.0.1');

// When login is blocked due to failures
bouncer.blocked = function (req, res, next, remaining)
{
    res.status(429).send(' יותר מדי בקשות התחברות כושלות, נסה מחדש בעוד ' + remaining / 1000 + ' שניות ' );
};



// API

// router.post('/register', function(req, res) {
//   var newUser = new User({
//       username: 'hila2',
//       password: '123456',
//       role: "Admin"
//     });

//     // Attempt to save the user
//     newUser.save(function(err) {
//       if (err) {
//         return res.json({ success: false, message: 'That email address already exists.'});
//       }
//       res.json({ success: true, message: 'Successfully created new user.' });
//     });
// });

// Example authentication

router.get('/dashboard', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), function(req, res) {
    res.send('It worked! User id role: ' + req.user.role + '.');
});

router.get('/dashboard3', passport.authenticate('jwtLogin', { session: false, failureRedirect: '/' }), function(req, res) {
    res.send('It worked! User id role: ' + req.user.role + '.');
});

router.get('/dashboard2', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    res.send('It worked! User id role: ' + req.user.role + '.');
});

// Authentication

router.post('/auth', bouncer.block, function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {throw err;};
        if (!user) {
          res.status(400).send('השם או הסיסמה שסופקו לא תואמים');
      } else {
      // Check if password matches
          user.comparePass(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
          // Lighten API Token
              var signUser = {};
              signUser._doc = user._doc;
              signUser._doc.pass = 'Encrypted.';

          // Create token if the password matched and no error was thrown
              var apiToken = jwt.sign(signUser, config.secret, {
                expiresIn: 600
            });

          // For creating a login token when needed
              var loginToken;

          // Check if this request is api token request or login request
              if(req.body.isLogin)
          {
                loginToken = jwt.sign({username: req.body.username}, config.loginSecret, {
                  expiresIn: 604800
              });
            }

          // Indicating that login was successful and no need to wait
              bouncer.reset(req);
              res.json({ success: true, apiToken: apiToken, loginToken: loginToken});
          } else {
              res.status(400).send('השם או הסיסמה שסופקו לא תואמים');
          }
        });
      }
    });
});

router.post('/refresh', passport.authenticate('jwtAdmin', { session: false }) , function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {throw err;};

    // Lighten API token
        var signUser = {};
        signUser._doc = user._doc;
        signUser._doc.pass = 'Encrypted.';

    // Create token if the password matched and no error was thrown
        var apiToken = jwt.sign(signUser, config.secret, {
          expiresIn: 600
      });

        res.json({success: true, apiToken: apiToken});
    });
  
});

router.post('/api/authapp',  function(req, res) {
    var hashedAuthReq = req.body.authReq;
    var currDate = new Date();
    var nHours, nMinutes;
    if(currDate.getUTCHours() < 10) {
        nHours = '0' + currDate.getUTCHours();
    } else {
        nHours = currDate.getUTCHours();
    }

    if(currDate.getUTCMinutes() < 10) {
        nMinutes = '0' + currDate.getUTCMinutes();
    } else {
        nMinutes = currDate.getUTCMinutes();
    }

    var nDay = currDate.getUTCDate();
    if (nDay < 10) {
        nDay = '0' + nDay;
    }

    var nMonth = currDate.getUTCMonth() + 1;
    if (nMonth < 10) {
        nMonth = '0' + nMonth;
    }

    var expectedString = config.expectedStringPrefix + ' ' + nDay +'/'+ nMonth + ' ' + nHours + ':' + nMinutes;
    var expectedHashed = crypto.createHash('sha256').update(expectedString).digest('hex');

    if(expectedHashed == hashedAuthReq) {
        var apiToken = jwt.sign({_doc: {_id: '57866c42c22f43782dd0b2e3'}}, config.secret, {
          expiresIn: 400
      });

        res.send(apiToken);
    } else {
        res.status(400).send('BADREQ');
    }
});

module.exports = router;
