'use strict';

var express = require('express');
var router = express.Router();
var upload = require('../image_upload/image-upload');
var path = require('path');
var https = require('https');
var fs = require('fs');
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var FCMLib = require('fcm-node');
var User = require('../Database/Models/UserSchema');
var bouncer =  require ('express-bouncer')(25000, 1000000, 3);
var crypto = require('crypto');
var emitter = require('../config/emitter');
var MetaInspector = require('node-metainspector');
var URLCheck = require('../config/urlCheck');
var ObjectID = require('mongodb').ObjectID;


/* 
*
* Definitions and initiallization
*
*/

// Initialize FCM
var fcm = new FCMLib(config.serverApi);

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});


// DB connection
mongoose.connect(config.database);

function setLastUpdateNow() {
    console.log('setLastUpdateNow');
    var time = new Date().getTime();

    settings.findOne({ isSettingsDocument: true}, function(err, doc) {
        if(err == null) {
            doc.lastUpdateAt = '/Date(' + time + ')/';
            doc.save();
        }
    });
};

// Adding localhost on the bruteforce whitelist
bouncer.whitelist.push('127.0.0.1');

// When login is blocked due to failures
bouncer.blocked = function (req, res, next, remaining)
{
    res.status(429).send(' יותר מדי בקשות התחברות כושלות, נסה מחדש בעוד ' + remaining / 1000 + ' שניות ' );
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

    console.log('expected string: ' + expectedString);
    console.log('expected hash: ' + expectedHashed);

    if(expectedHashed == hashedAuthReq) {
        var apiToken = jwt.sign({_doc: {_id: '57866c42c22f43782dd0b2e3'}}, config.secret, {
          expiresIn: 400
      });

        console.log(apiToken);

        res.send(apiToken);
    } else {
        res.status(400).send('BADREQ');
    }
});

 router.post('/api/preview/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
       URLCheck(req.body.urlToDigest).then(function() {
           var client = new MetaInspector(req.body.urlToDigest, { timeout: 5000 });
           client.on("fetch", function(){
               // Create basic preview
               var lnkPreview = {
                                    title: client.title,
                                    url: client.url,
                                    baseUrl: client.host,
                                    description: client.description,
                                    imageUrl: client.image,
                                    keywords: client.keywords
                                };
             
             // Check for OpenGraph
             if(client.ogTitle) {lnkPreview.title = client.ogTitle};
             if(client.ogDescription) {lnkPreview.description = client.ogDescription};
             if(client.images.length > 0) {lnkPreview.images = client.images.slice(0,16); lnkPreview.images._root = null; lnkPreview.images.options=null; lnkPreview.images.prevObject = null;}

             res.json(lnkPreview);
            });

            client.on("error", function(err){
                res.status(400).send("Cannot preview link");
            });

            client.fetch();
        },
        function() {
            res.status(400).send("Invalid URL");
        })
  });

// Courses
var coursesSchema = mongoose.Schema(require('../Database/Models/CourseSchema'));
var courses = mongoose.model('courses', coursesSchema);

// Get all courses
router.get('/api/courses', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    courses.find(function (err, courses) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');

        if(req.query.light) {
            var lightArr = [];
            courses.forEach(function(currCourse) {
                lightArr.push({"text": currCourse._doc.CourseCode + " - " + currCourse._doc.Name, "id": currCourse._doc.CourseCode});
             });

            res.json(lightArr);
        } else {
            res.json(courses);
        }
    });
});



// Create course
router.post('/api/courses', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    var fileName = req.body.CourseCode + '.' + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
    var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
    https.get(req.body.imageUrl, function(result) {
        result.pipe(file);
        // setLastUpdateNow();
        req.body.PictureUrl = "http://marshalweb.azurewebsites.net/images/" + fileName;
        // courses.create(req.body, function(err, course) {
        //     if (err) {
        //         res.status(400).json({message: 'Couldn\'t create new course..'});
        //         console.log(err);
        //     } else {
        //         setLastUpdateNow();
        //         res.status(201).json({ message: 'Created successfuly' });
        //     }
        // });
        courses.update({ID : req.body.ID},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                 console.log(result);
                 setLastUpdateNow();
                 res.status(201).json({ message: 'Created successfuly' });
             } else {
                 console.log(err);
                 res.status(400).json({message: 'Couldn\'t create new course..'});
             }
         });
        // res.json({ error_code : 0, err_desc : null, filename : fileName });
    });
});

// Update courses (any property)
router.put('/api/courses/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.update({ CourseCode: req.params.courseCode}, req.body, function(err, result) {
            // If everything's alright
        if (!err && result.ok === 1) {
            setLastUpdateNow();
            res.json({ code: 200});
        } else {
            res.json({code:400, error: 'something went wrong..'});
            console.log(err, result);
        }
    });
});

// // Delete courses
router.delete('/api/courses/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.remove({ CourseCode: req.params.courseCode }, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'Deleted course!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t delete course' });
        }
    });
});

// // Images
router.get('/api/courses/images/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function (req, res, next) {
    courses.findOne({ CourseCode: req.params.courseCode }, 'PictureUrl', function(err, picUrl) {
        // If there's no error
        if (!err) {
            res.sendFile('images/' + picUrl._doc.PictureUrl, { root: path.join(__dirname, '../public') });
        }
    });
});

router.post('/api/courses/images/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    // Checks if only url has been sent
    if (req.body.imageUrl) {
        var fileName = req.params.courseCode + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
        var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
        https.get(req.body.imageUrl, function(result) {
            result.pipe(file);
            // setLastUpdateNow();
            res.json({ error_code : 0, err_desc : null, filename : fileName });
        });
    }
});

// Add rating
router.post('/api/courses/ratings/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.update({CourseCode : req.params.courseCode},
                    {$addToSet : {Ratings : req.body}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'rating added successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t add rating' });
        }
    });
});

// Update rating
router.put('/api/courses/ratings/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.update({CourseCode : req.params.courseCode,
        'Ratings.userMailAddress' : req.body.userMailAddress},
                    {$set : {'Ratings.$.rating' : req.body.rating,
                'Ratings.$.comment' : req.body.comment,
                'Ratings.$.lastModified' : req.body.lastModified}}, function(err, numAffected) {
        if (!err) {
            console.log(numAffected);
            res.json({ code: 201, message: 'rating updated successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t update rating' });
        }
    });
});

// Remove rating
router.delete('/api/courses/ratings/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.update({CourseCode : req.params.courseCode,
        'Ratings.userMailAddress' : req.body.userMailAddress},
                    {$pull : {Ratings : {userMailAddress : req.body.userMailAddress}}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'rating removed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t remove rating' });
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////
// Materials
var materialsSchema = mongoose.Schema(require('../Database/Models/MaterialSchema'));
var materials = mongoose.model('materials', materialsSchema);

// Get all materials
router.get('/api/materials/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    materials.find(function (err, materials) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(materials);
    });
});

// Create material TODO: Ask Ido wtf is going on here
router.post('/api/materials', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    materials.update({url : req.body.url},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                 console.log(result);
                 setLastUpdateNow();
                 res.status(201).send('V');
             } else {
                 console.log(err);
                 res.status(400).send('X');
             }
         });
});

router.delete('/api/materials/:urlToRemove', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    materials.remove({_id: ObjectID(req.params.urlToRemove)}, function(err) {
        if (!err) {
            setLastUpdateNow();
            res.status(201).send("V");
        } else {
            console.log(err);
            res.status(400).send(err);
        }
    });
});

// Malshabs
var malshabItemSchema = mongoose.Schema(require('../Database/Models/MalshabItemSchema'));
var malshabItems = mongoose.model('malshabItems', malshabItemSchema);

// Get all malshab items
router.get('/api/malshabitems/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    malshabItems.find(function (err, malshabItems) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(malshabItems);
    });
});

// Create malshab item
router.post('/api/malshabitems', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    malshabItems.update({url : req.body.url},
    req.body, {upsert:true}, function(err, result) {
        if(!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'malshab item created successfully! :)' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t create malshab item... :(' });
        }
    });
});

// Ratings
var ratingsSchema = mongoose.Schema(require('../Database/Models/RatingSchema'));
var ratings = mongoose.model('ratings', ratingsSchema);

// Get all ratings
router.get('/api/ratings/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    ratings.find(function (err, ratings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(ratings);
    });
});

// Create rating
router.post('/api/ratings', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), function(req, res) {
    ratings.create(req.body, function(err, rating) {
        if (err) {
            res.json({ code: 400, message: 'Couldn\'t create new rating..'});
            console.log(err);
        } else {
            setLastUpdateNow();
            res.json({ code: 201, message: 'Created successfuly' });
        }
    });
});

// Get rating by course id
router.get('/api/ratings/:courseCode', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    ratings.find({ courseCode: req.params.courseCode } , function(err, ratings) {
        if (err) return console.error(err);
        setLastUpdateNow();
        res.setHeader('Content-Type', 'application/json');
        res.json(ratings);
    });
});
/////////////////////////////////////////////////

// Delete rating
router.delete('/api/ratings/:courseCode/:userMailAddress',  passport.authenticate('jwt', { session: false }), function(req, res) {
    ratings.remove({ courseCode : req.params.courseCode,
        userMailAddress : req.params.userMailAddress}, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'Deleted rating!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t delete rating' });
        }
    });
});

// // Update rating (any property)
router.put('/api/ratings',  passport.authenticate('jwt', { session: false }), function(req, res) {
    ratings.update({ courseCode : req.body.courseCode,
            userMailAddress : req.body.userMailAddress}, req.body, function(err, result) {
        // If everything's alright
                if (!err && result.ok === 1) {
                    setLastUpdateNow();
                    res.json({ code: 200});
                } else {
                    res.json({error: 'something went wrong..'});
                    console.log(err, result);
                }
            });
});

// FCM
// Registrations
var FcmRegistrationSchema = mongoose.Schema(require('../Database/Models/FcmRegistrationSchema'));
var registrations = mongoose.model('fcmregistrations', FcmRegistrationSchema);

router.post('/api/fcm/register',  passport.authenticate('jwt', { session: false }), function(req, res) {
    registrations.update({hardwareId : req.body.hardwareId},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                 console.log(result);
                 res.json({ code: 201, message: 'registered successfully! :)' });
             } else {
                 console.log(err);
                 res.json({ code: 400, message: 'Couldn\'t register... :(' });
             }
         });
});

// Update registration (tokenId only) ////////////////////
router.put('/api/fcm/register',  passport.authenticate('jwt', { session: false }), function(req, res) {
    registrations.update({hardwareId : req.body.hardwareId}, req.body, function(err, result) {
            // If everything's alright
        if (!err && result.ok === 1) {
            res.json({ code: 200});
        } else {
            res.json({error: 'something went wrong..'});
            console.log(err, result);
        }
    });
});

// Delete registration ////////////////////////////////
router.delete('/api/fcm/unregister/:hardwareId',  passport.authenticate('jwt', { session: false }), function(req, res) {
    registrations.remove({hardwareId : req.params.hardwareId}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'UnRegistered!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t unregister' });
        }
    });
});

// Add channel
router.post('/api/fcm/channels/:hardwareId/:channel', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$addToSet : {channels : req.params.channel}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'channel added successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t add channel' });
        }
    });
});

// Remove channel
router.delete('/api/fcm/channels/:hardwareId/:channel', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$pull : {channels : req.params.channel}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'channel removed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t remove channel' });
        }
    });
});


// Add course subscription
router.post('/api/fcm/subscription/course/:hardwareId/:course_id', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$addToSet : {courses : req.params.course_id}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'Subscribed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t subscribe' });
        }
    });
});

// Remove course subscription
router.delete('/api/fcm/subscription/course/:hardwareId/:course_id', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$pull : {courses : req.params.course_id}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'Unsubscribed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t unsubscribe' });
        }
    });
});

// Get registration
router.get('/api/fcm/registrations/:hardwareId', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    registrations.findOne({hardwareId : req.params.hardwareId},function (err, registration) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(registration);
    });
});

////////////// Send Push ///////////////////////////
function sendPush(registrations, dataObject) {

    // Add the registration tokens of the devices you want to send to
    var registrationIds = [];
    registrations.forEach(function(registration){
        registrationIds.push(registration.registrationTokenId);
    });

    var message = {
        registration_ids: registrationIds, 
        data: dataObject
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!", err);
            // res.json({ code: 400, message: err });
        } else {
            console.log("Successfully sent with response: ", response);
            // res.json({ code: 201, message: response });
        }
    });
}

router.post('/api/fcm/sendpush/', function(req, res) {
    if (req.body.channels != undefined && req.body.channels.length > 0
             && req.body.courses != undefined && req.body.courses.length > 0) {
        registrations.find({$or: [{channels: { $in : req.body.channels}},
                        {courses: { $in : req.body.courses}}]},'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else if ((req.body.channels == undefined || req.body.channels.length == 0) 
                    && (req.body.courses != undefined && req.body.courses.length > 0)) {
        registrations.find({courses: { $in : req.body.courses}}
                    ,'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else if ((req.body.courses == undefined || req.body.courses.length == 0) 
                    && (req.body.channels != undefined && req.body.channels.length > 0)) {
        registrations.find({channels: { $in : req.body.channels}}
                    ,'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else {
        registrations.find({},'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    }
});

// Settings
var settingsSchema = mongoose.Schema(require('../Database/Models/SettingsSchema'));
var settings = mongoose.model('Settings', settingsSchema);

// Get settings
router.get('/api/settings/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    settings.findOne(function (err, settings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(settings);
    });
});

router.get('/api/channels/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    settings.findOne(function (err, settings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(settings._doc.channels);
    });
});


module.exports = router;
