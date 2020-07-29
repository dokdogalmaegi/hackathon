var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/login', (req, res, next) => {
  if (req.session) { // session의 값이 null or undefined 확인
    res.render('main');
  } else {
    res.render('login');
  }
});

router.get('/register', (req, res, next) => {
  if (req.session) {
    res.render('main');
  } else {
    res.render('register');
  }
})

router.post('/register', (req, res, next) => {
  res.render('login');
})

module.exports = router;
