const express = require('express');
const session = require('express-session');
const { equal } = require('assert');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/user');
const Content = require('../models/content');
const { emitWarning } = require('process');
const { fstat, readFile, renameSync } = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  Content.find((err, content) => {
    if (err) return console.error(err);
    JSON.stringify(content)
    return res.render('main', {name: req.session.name, data: content });
  });
});

router.get('/login', (req, res, next) => {
  if (req.session) { // session의 값이 null or undefined 확인
    res.render('login');
  } else {
    res.render('main');
  }
});

router.get('/register', (req, res, next) => {
  if (req.session) {
    res.render('register', {fail : null});
  } else {
    res.render('main');
  }
})

router.post('/register', (req, res, next) => {
  let newUser = new User();
  User.exists({ id: req.body.id }, (err, isexists) => {
    if (isexists) return res.render('register', { fail: "아이디가 중복입니다." })
    newUser.id = req.body.id;
    newUser.pw = req.body.pw;
    newUser.name = req.body.name;
    if (newUser.id && newUser.pw && newUser.name) {
      newUser.save((err, user) => {
        if (err) return console.error(err);
        console.dir(user);
        return res.render('login');
      })
    }
    else {
      return res.status(403).json({ err: err });
    }
  })
})

router.post('/login', (req, res, next) => {
  console.log(req.body);
  User.find({ $and: [{ id: req.body.id }, { pw: req.body.pw }] }, (err, user) => {
    if (err) return console.error(err);
    if (user.length < 1) return res.error("찾아오는 계정이 초과했습니다.");
    req.session.name = user[0].name;
    return res.redirect('/');
  })
})

router.post('/logout', (req, res, next) => {
  if (!req.session) return res.redirect('/');
  req.session.destroy();
  res.redirect('/');
})

router.get('/home', (req, res, next) => {
  res.redirect('/');
})









router.get('/result', (req, res, next) => {
  User.find((err, user) => {
    if (err) return console.error(err);
    return res.json(user);
  });
})

router.get('/contentlog', (req, res, next) => {
  Content.find((err, content) => {
    if (err) return console.error(err);
    return res.json(content);
  });
})

router.get('/result/delete', (req, res, next) => {
  User.remove({ $and: [{ id: req.body.id }, { pw: req.body.pw }, { name: req.body.name }] }, (err, user) => {
    if (err) return console.error(err);
    return res.json(user);
  });
})

router.get('/contentlog/delete', (req, res, next) => {
  Content.remove({ title: req.body.title }, (err, content) => {
    if (err) return console.error(err);
    return res.json(content);
  })
})



module.exports = router;
