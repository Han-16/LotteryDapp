var express = require('express');
const router = require("express").Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '안녕하세요' });
});

router.use("/", require("./api"));

module.exports = router;