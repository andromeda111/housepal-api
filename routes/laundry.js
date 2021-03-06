const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);

router.get('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    db('laundry').where({house_id: decoded.house_id}).then(result => {
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.put('/on/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    let houseId = req.params.id
    let toggleData = req.body

    db('laundry').where({house_id: houseId}).update(toggleData).then(result => {
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.put('/notify/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    let houseId = decoded.house_id
    let notifyId = req.params.id
    let notifyData = req.body

    db('laundry').where({house_id: houseId}).update(notifyData).then(result => {
      res.json(result);
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
