var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scenario3', { title: 'scenario 3' });
});

module.exports = router;
