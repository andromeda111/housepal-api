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
    db('users').where({house_id: decoded.house_id}).then(result => {
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.get('/current', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('users').where({house_id: decoded.house_id, id: decoded.id}).then(result => {
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.get('/user', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('users').where({id: decoded.id}).then(result => {
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.put('/leave/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    let delUserId = parseInt(req.params.id)
    db('users').update({house_id: null}).where({id: delUserId}).then(() => {
      db('chores').where({house_id: decoded.house_id}).then(chores => {
        if (chores) {
          let choresWithUser = chores.filter(chore => {
            return chore.cycle.cycleList.includes(delUserId)
          })
          choresWithUser.forEach(chore => {
            db('chores').where({id: chore.id}).del('*').then(() => {})
          })
        }
      })
      res.status(200)
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
