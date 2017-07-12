const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/', function(req, res, next) {
  res.send('success');
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
