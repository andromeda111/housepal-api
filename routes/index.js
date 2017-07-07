const express = require('express');
const router = express.Router();
const db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cp-server' });
});

router.get('/data', function(req, res, next) {
  db('houses').then(result => {
    console.log(result);
    res.json(result);
  })
});

module.exports = router;
