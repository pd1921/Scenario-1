var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scenario2', { title: 'scenario 2' });
});

router.get('/videoStream1', function(req, res, next) {
  res.render('videoStream', { title: 'videoStream 1', target: '球賽現場' });
});

router.get('/videoStream2', function(req, res, next) {
  res.render('videoStream', { title: 'videoStream 2', target: '賽評畫面' });
});

router.get('/videoStream3', function(req, res, next) {
  res.render('scenario2', { title: 'scenario 2' });
});

module.exports = router;
