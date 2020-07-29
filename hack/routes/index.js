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

// GET main page.
router.get('/', function(req, res, next) {
  Content.find((err, content) => {
    if (err) return console.error(err);
    JSON.stringify(content)
    return res.render('main', {name: req.session.name, data: content });
  });
});

// GET login page.
router.get('/login', (req, res, next) => {
  if (req.session) { // session의 값이 null or undefined 확인
    res.render('login');
  } else {
    res.render('main');
  }
});

// GET register page.
router.get('/register', (req, res, next) => {
  if (req.session) {
    res.render('register', {fail : null});
  } else {
    res.render('main');
  }
})

// Content Download Response
router.get('/download/:file', (req, res, next) => {
  console.log(req.params.file);
  res.download(`./uploads/${req.params.file}`);
})

// Register Response
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

// Login Response
router.post('/login', (req, res, next) => {
  console.log(req.body);
  User.find({ $and: [{ id: req.body.id }, { pw: req.body.pw }] }, (err, user) => {
    if (err) return res.render('register', { fail: "존재하지 않는 아이디입니다." });
    if (user.length < 1) return res.error("찾아오는 계정이 초과했습니다.");
    req.session.name = user[0].name;
    return res.redirect('/');
  })
})

// Logout Response
router.post('/logout', (req, res, next) => {
  if (!req.session) return res.redirect('/');
  req.session.destroy();
  res.redirect('/');
})

// Write Content Response
router.post('/writebox', (req, res, next) => {
  console.log(req.files);
  let newContent = new Content();
  newContent.author = req.session.name;
  newContent.title = req.body.file_title;
  newContent.content = req.body.file_content;
  newContent.file = req.files[0].originalname;
  let extension = path.extname(req.files[0].originalname).substr(1, 5);
  newContent.extension = extension;
  newContent.save((err, content) => {
    if(err) return console.error(err);
    console.dir();
    return res.redirect('/');
  })
  renameSync(`${process.cwd()}/uploads/${req.files[0].filename}`, `${process.cwd()}/uploads/${req.files[0].originalname}`);
});



router.get('/home', (req, res, next) => {
  res.redirect('/');
})



router.post('/userinfo', (req, res, next) => { // 유저 정보 받아오기
  User.find((err, user) => {
    if (err) return console.error(err);
    return res.json(user);
  });
})

router.post('/contentlog', (req, res, next) => { // 게시판 정보 받아오기
  Content.find((err, content) => {
    if (err) return console.error(err);
    return res.json(content);
  });
})

router.post('/userinfo/delete', (req, res, next) => { // user정보 관리 (삭제)
  User.remove({ $and: [{ id: req.body.id }, { pw: req.body.pw }, { name: req.body.name }] }, (err, user) => {
    if (err) return console.error(err);
    return res.json(user);
  });
})

router.post('/contentlog/delete', (req, res, next) => { // 게시판 정보 관리 (삭제)
  Content.remove({ title: req.body.title }, (err, content) => {
    if (err) return console.error(err);
    return res.json(content);
  })
})



module.exports = router;
