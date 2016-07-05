var express = require('express');
var router = express.Router();
// var db = require('../Database/mongoObject');
// var dbMaterials = require('../Database/mongoObjectMaterials');
// var dbRatings = require('../Database/mongoObjectRatings');
// var dbSettings = require('../Database/mongoObjectSettings');
// var dbGcmRegisterations = require('../Database/mongoObjectGcmRegisteration');
// var dbMalshabItem = require('../Database/mongoObjectMalshabItem');
// var dbGeneral = require('../Database/mongoObjectGeneral');
var db
var upload = require('../image_upload/image-upload');
var path = require('path');
var https = require('https');
var fs = require('fs');
var gcm = require('node-gcm');
var mongoose = require('mongoose')

// DB connection
mongoose.connect('mongodb://marshalmongo.cloudapp.net/Marshal');

// function setLastUpdateNow() {
//     console.log("setLastUpdateNow");
//     var time = new Date().getTime();
    
//     dbSettings
//     .then(function (settings) {
//         settings.findOne({ isSettingsDocument: true}, function(err, doc) {
//             if(err == null) {
//                 doc.lastUpdateAt = '/Date(' + time + ')/';
//                 doc.save(); 
//             }
//         });
//     });
// };

// Layouts

router.get('/', function(req, res, next) {
  res.render('index');
});

// Pages

router.get('/index', function(req, res, next) {
    res.render('pages/index');
});

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

// // Update courses (any property)
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