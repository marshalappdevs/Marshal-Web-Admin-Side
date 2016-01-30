var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Marshal' });
});

router.get('/index', function(req, res, next) {
    res.render('pages/index');
});

router.get('/courseModal', function(req, res, next) {
    res.render('modals/courseModal');
});

module.exports = router;
