var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hello page. */
router.get('/hello', function(req, res) {
  res.render('hello');
});

module.exports = router;