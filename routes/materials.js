'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var emitter = require('../config/emitter');
var MetaInspector = require('node-metainspector');
var URLCheck = require('../config/urlCheck');
var ObjectID = require('mongodb').ObjectID;
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

var materials = require('../Database/Models/MaterialSchema');

// Get all materials
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    materials.find(function (err, materials) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(materials);
    });
});

// Get page
router.get('/:page', function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    materials.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

// Create material TODO: Ask Ido wtf is going on here
router.post('/', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
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

router.delete('/:urlToRemove', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
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

router.post('/preview', passport.authenticate('jwt', { session: false }), function(req, res, next) {
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

module.exports = router;