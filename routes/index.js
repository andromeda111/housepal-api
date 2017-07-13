const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/deleteHouse', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  db('houses').del().where({id: 1}).then(() => {
    res.status(200)
  })
});

// MEMBER INFO TEST ROUTE
router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    db('users').where({id: decoded.id}).then(userData => {
      console.log(userData);
      if (!userData) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        res.json({success: true, msg: 'Welcome in the member area ' + userData[0].name + '!'});
      }
    }).catch(err =>{
      console.error(err);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
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
