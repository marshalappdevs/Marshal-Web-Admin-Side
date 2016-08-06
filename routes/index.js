var express = require('express');
var router = express.Router();
var upload = require('../image_upload/image-upload');
var path = require('path');
var https = require('https');
var fs = require('fs');
var gcm = require('node-gcm');
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var User = require('../Database/Models/UserSchema');
var bouncer =  require ("express-bouncer")(25000, 1000000, 3);
var crypto = require('crypto');

/* 
*
* Definitions and initiallization
*
*/

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// DB connection
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

function setLastUpdateNow() {
    console.log("setLastUpdateNow");
    var time = new Date().getTime();

    settings.findOne({ isSettingsDocument: true}, function(err, doc) {
            if(err == null) {
                doc.lastUpdateAt = '/Date(' + time + ')/';
                doc.save();
            }
    });
};

// Adding localhost on the bruteforce whitelist
bouncer.whitelist.push("127.0.0.1");

// When login is blocked due to failures
bouncer.blocked = function (req, res, next, remaining)
{
    res.status(429).send(" יותר מדי בקשות התחברות כושלות, נסה מחדש בעוד " + remaining / 1000 + " שניות " );
};

/* 
*
* ROUTING
*
*/

// Modals

router.get('/courseModal', function(req, res, next) {
    res.render('modals/courseModal');
});

router.get('/addCourseModal', function(req, res, next) {
    res.render('modals/addCourseModal');
});

// Directives

router.get('/courseField', function(req, res, next) {
    res.render('directives/courseField');
});

router.get('/imageUploadField', function(req, res, next) {
    res.render('directives/imageUploadField');
});

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
    if (err) {throw err};
    if (!user) {
      res.status(400).send('השם או הסיסמה שסופקו לא תואמים');
    } else {
      // Check if password matches
      user.comparePass(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var apiToken = jwt.sign(user, config.secret, {
            expiresIn: 600
          });
          var loginToken;

          // Check if this request is api token request or login request
          if(req.body.isLogin)
          {
            loginToken = jwt.sign({username: req.body.username}, config.loginSecret, {
                expiresIn: 10800
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
    if (err) {throw err};

    // Create token if the password matched and no error was thrown
    var apiToken = jwt.sign(user, config.secret, {
        expiresIn: 600
    });

    res.json({success: true, apiToken: apiToken});
    });
  
});

router.post('/api/authapp', function(req, res) {
  var hashedAuthReq = req.body.authReq;
  console.log(hashedAuthReq);
  var currDate = new Date();
  var nHours, nMinutes;
  if(currDate.getUTCHours() < 10) {
      nHours = "0" + currDate.getUTCHours();
  } else {
      nHours = currDate.getUTCHours();
  }

  if(currDate.getUTCMinutes() < 10) {
      nMinutes = "0" + currDate.getUTCMinutes();
  } else {
      nMinutes = currDate.getUTCMinutes();
  }
  
  var expectedString = config.expectedStringPrefix + " " + currDate.getUTCDate()+"/"+ (currDate.getUTCMonth() + 1) + " " + nHours + ":" + nMinutes;

  var expectedHashed = crypto.createHash('sha256').update(expectedString).digest('hex');


  if(expectedHashed == hashedAuthReq) {
    var apiToken = jwt.sign({username: "hila",password: "123456", role: "Client"}, config.secret, {
            expiresIn: 400
    });

    res.send(apiToken);
  } else {
      res.status(400).send('BADREQ');
  }
});


// Courses
var coursesSchema = mongoose.Schema(require('../Database/Models/CourseSchema'));
var courses = mongoose.model('Courses', coursesSchema);

// Get all courses
router.get('/api/courses', function(req, res, next) {
    courses.find(function (err, courses) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(courses);
    });
});

// Create course
router.post('/api/courses', function(req, res) {
    courses.create(req.body, function(err, course) {
        if (err) {
            res.json({ code: 400, message: "Couldn't create new course.."});
            console.log(err);
        } else {
            setLastUpdateNow();
            res.json({ code: 201, message: "Created successfuly" });
        }
    });
});

// Update courses (any property)
router.put('/api/courses/:id', function(req, res) {
    courses.update({ ID: req.params.id}, req.body, function(err, result) {
            // If everything's alright
            if (!err && result.ok === 1) {
                setLastUpdateNow();
                res.json({ code: 200});
            } else {
                res.json({code:400, error: "something went wrong.."});
                console.log(err, result);
            }
    });
});

// // Delete courses
router.delete('/api/courses/:courseId', function(req, res) {
    courses.remove({ ID: req.params.courseId }, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: "Deleted course!" });
        } else {
            console.log(err);
            res.json({ code: 400, message: "Couldn't delete course" })
        }
    });
});

// // Images

router.get('/api/images/:courseId', function (req, res, next) {
    courses.findOne({ CourseCode: req.params.courseId }, 'PictureUrl', function(err, picUrl) {
        // If there's no error
        if (!err) {
            res.sendFile('images/' + picUrl._doc.PictureUrl, { root: path.join(__dirname, '../public') });
        }
    })
});

router.post('/api/images', function(req, res) {
    // Checks if only url has been sent
    if (req.body.imageUrl) {
        var datetimestamp = Date.now();
        var fileName = "file-" + datetimestamp + "." + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
        var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
        https.get(req.body.imageUrl, function(result) {
            result.pipe(file);
            setLastUpdateNow();
            res.json({ error_code : 0, err_desc : null, filename : fileName });
        });
    } else {
        // If not only url, then the user want to upload from his local disk
        upload(req, res, function(err) {
            if (err) {
                res.json({ error_code : 1, err_desc : err });
                return;
            }
            res.json({ error_code : 0, err_desc : null, filename : req.file.filename });
        });
    }
});

// Materials
var materialsSchema = mongoose.Schema(require('../Database/Models/MaterialSchema'));
var materials = mongoose.model('materials', materialsSchema);

// Get all materials
router.get('/api/materials/', function(req, res, next) {
    materials.find(function (err, materials) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(materials);
    });
});

// Create material TODO: Ask Ido wtf is going on here
router.post('/api/materials', function(req, res) {
    dbMaterials
    .then(function(materials) {
        materials.update({url : req.body.url},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                console.log(result);
                setLastUpdateNow();
                res.json({ code: 201, message: "material created successfully! :)" });
             } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't create material... :(" })
             }
         })
});
    // dbMaterials
    // .then(function(materials) {
    //     materials.create(req.body, function(err, material) {
    //         if (err) {
    //             res.json({ code: 400, message: "Couldn't create new material.."});
    //             console.log(err);
    //         } else {
    //             setLastUpdateNow();
    //             res.json({ code: 201, message: "Created successfuly" });
    //         }
    //     });
    // });
});

// Malshabs
var malshabItemSchema = mongoose.Schema(require('../Database/Models/MalshabItemSchema'));
var malshabItems = mongoose.model('malshabItems', malshabItemSchema);

// Get all malshab items
router.get('/api/malshabitems/', function(req, res, next) {
    malshabItems.find(function (err, malshabItems) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(malshabItems);
    });
});

// Create malshab item
router.post('/api/malshabitems', function(req, res) {
    malshabItems.update({url : req.body.url},
    req.body, {upsert:true}, function(err, result) {
        if(!err) {
        console.log(result);
        setLastUpdateNow();
        res.json({ code: 201, message: "malshab item created successfully! :)" });
        } else {
        console.log(err);
        res.json({ code: 400, message: "Couldn't create malshab item... :(" })
        }
    })
});

// Ratings
var ratingsSchema = mongoose.Schema(require('../Database/Models/RatingSchema'));
var ratings = mongoose.model('ratings', ratingsSchema);

// Get all ratings
router.get('/api/ratings/', function(req, res, next) {
    ratings.find(function (err, ratings) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(ratings);
    });
});

// Create rating
router.post('/api/ratings', function(req, res) {
    ratings.create(req.body, function(err, rating) {
            if (err) {
                res.json({ code: 400, message: "Couldn't create new rating.."});
                console.log(err);
            } else {
                setLastUpdateNow();
                res.json({ code: 201, message: "Created successfuly" });
            }
    });
});

// Get rating by course id
router.get('/api/ratings/:courseId', function (req, res, next) {
    ratings.find({ courseId: req.params.courseId } , function(err, ratings) {
            if (err) return console.error(err);
            setLastUpdateNow();
            res.setHeader('Content-Type', 'application/json');
            res.json(ratings);
    })
});
/////////////////////////////////////////////////

// Delete rating
router.delete('/api/ratings/:courseCode/:userMailAddress', function(req, res) {
    ratings.remove({ courseCode : req.params.courseCode,
        userMailAddress : req.params.userMailAddress}, function(err, result) {
            if (!err) {
                console.log(result);
                setLastUpdateNow();
                res.json({ code: 201, message: "Deleted rating!" });
            } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't delete rating" })
            }
        });
});

// // Update rating (any property)
router.put('/api/ratings', function(req, res) {
    ratings.update({ courseCode : req.body.courseCode,
            userMailAddress : req.body.userMailAddress}, req.body, function(err, result) {
        // If everything's alright
        if (!err && result.ok === 1) {
            setLastUpdateNow();
            res.json({ code: 200});
        } else {
            res.json({error: "something went wrong.."});
            console.log(err, result);
        }
    });
});

// GCM
// Registerations
var GcmRegisterationSchema = mongoose.Schema(require('../Database/Models/GcmRegisterationSchema'));
var regisrations = mongoose.model('GcmRegisterations', GcmRegisterationSchema);

router.post('/api/gcm/register', function(req, res) {
    // dbGcmRegisterations
    // .then(function(registerations) {
    //     registerations.create(req.body, function(err, registeration) {
    //         if (err) {
    //             res.json({ code: 400, message: "Couldn't create new registeration.."});
    //             console.log(err);
    //         } else {
    //             res.json({ code: 201, message: "Created successfuly" });
    //         }
    //     });
    // });
    registerations.update({hardwareId : req.body.hardwareId},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                console.log(result);
                res.json({ code: 201, message: "registered successfully! :)" });
             } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't register... :(" })
             }
         })
});

// Update registeration (tokenId only) ////////////////////
router.put('/api/gcm/register', function(req, res) {
    registerations.update({hardwareId : req.body.hardwareId}, req.body, function(err, result) {
            // If everything's alright
            if (!err && result.ok === 1) {
                res.json({ code: 200});
            } else {
                res.json({error: "something went wrong.."});
                console.log(err, result);
            }
        });
});

// Delete registeration ////////////////////////////////
router.delete('/api/gcm/unregister/:hardwareId', function(req, res) {
    registerations.remove({hardwareId : req.params.hardwareId}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: "UnRegistered!" });
        } else {
            console.log(err);
            res.json({ code: 400, message: "Couldn't unregister" })
        }
    });
});

/////////////// Send Push ///////////////////////////
router.post('/api/gcm/sendpush/:messageContent', function(req, res) {
    registerations.find(function (err, registerations) {
        if (err)
            return console.error(err);
        else if (registerations.length > 0) {
                // Set up the sender with marshaldevs@gmail.com API key
            var sender = new gcm.Sender('AIzaSyAsgh-FO4NHH25pPoEeUFJj0AptIs6guwU');

            // Initialize Message object
            var message = new gcm.Message();
            message.addData('message', req.params.messageContent);

            // Add the registration tokens of the devices you want to send to
            var registrationTokens = [];
            registerations.forEach(function(registeration){
                registrationTokens.push(registeration.registerationTokenId);
            });

            // Send the message
            // ... trying only once
            sender.send(message, { registrationTokens: registrationTokens },10, function(err, response) {
                if(err) console.error(err);
                else {
                    console.log(response);
                    // res.json(response);
                }
            });
        } else
            console.log("No GCM Registerations");
            // res.json({noGcmRegisterations:true});
    });
});

// Settings
var settingsSchema = mongoose.Schema(require('../Database/Models/SettingsSchema'));
var settings = mongoose.model('Settings', settingsSchema);

// Get settings
router.get('/api/settings/', function(req, res, next) {
    settings.findOne(function (err, settings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(settings);
    });
});


module.exports = router;
