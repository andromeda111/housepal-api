const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/house/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    let houseId = req.params.id

    db('houses').where({id: houseId}).then(result => {
      res.json(result)
    }).catch(() => {
      res.status(400).send({success: false, msg: 'CATCH House does not exist, or password incorrect.'});
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
})

router.post('/join', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  const joinHouse = req.body.title
  const joinCode = req.body.code

  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('houses').where({title: joinHouse, code: joinCode}).then(result => {
      if (!result[0]) {
        err()
      } else {
        let houseId = result[0].id
        db('users').update({house_id: houseId}).where({id: decoded.id}).returning('*').then(user => {
          token = jwt.encode(user[0], process.env.JWT_SECRET);
          res.status(200).send({success: true, msg: 'House successfully joined.', newToken: 'JWT ' + token});
        })
      }
    }).catch(() => {
      res.status(400).send({success: false, msg: 'Try again; house does not exist.'});
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/create', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  const newHouse = req.body

  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('houses').insert(newHouse).returning('*').then(result => {
      let houseId = result[0].id
      let newLaundry = {
        washer_status: false,
        washer_start_time: {time: null},
        washer_current_user: {id: null, name: null},
        washer_notify: {users: null},
        dryer_status: false,
        dryer_start_time: {time: null},
        dryer_current_user: {id: null, name: null},
        dryer_notify: {users: null},
        house_id: houseId
      }
      db('laundry').insert(newLaundry).returning('*').then(result => {
        console.log('New laundry created.');
        db('users').update({house_id: houseId}).where({id: decoded.id}).returning('*').then(user => {
          let token = jwt.encode(user[0], process.env.JWT_SECRET);
          res.status(200).send({success: true, msg: 'House successfully created.', newToken: 'JWT ' + token});
        })
      })
    }).catch(err => {
      res.status(400).send({success: false, msg: 'Try again; house already exists.', err: err});
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
