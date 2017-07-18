const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting /messageboard');
  let token = getToken(req.headers);

  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    db('message_board').where({house_id: decoded.house_id}).then(result => {
      res.json(result);
    })

  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting messageboard router');
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    const newMsg = {posterId: decoded.id, posterName: decoded.name, content: req.body.content, postTime: {postTime: req.body.postTime}, house_id: decoded.house_id}

    console.log(newMsg);

    db('message_board').insert(newMsg).returning('*').then(result => {
      console.log(result);
      res.json(result)
    }).catch(err => {
      console.log(err);
      res.status(400).send({success: false, msg: 'Error. Try again.', err: err});
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
