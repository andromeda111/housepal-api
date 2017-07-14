const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting /list');
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    db('chores').where({house_id: decoded.house_id}).then(result => {
      console.log('Hitting route ', result);
      res.json(result);
    })

    // db('chores').innerJoin('users_chores', 'chores.id', 'users_chores.chore_id').innerJoin('users', 'users.id', 'users_chores.user_id').then(collection => {
    //   console.log(collection);
    // })
    //
    // db('chores').where({house_id: decoded.house_id}).then(result => {
    //   console.log('Hitting route ', result);
    //   res.json(result);
    // })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/new', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('router: body', req.body);
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let newChore = req.body
    newChore.house_id = decoded.house_id

    db('chores').insert(newChore).returning('*').then(postedChore => {
      console.log(postedChore);
      db('users_chores').insert({user_id: decoded.id, chore_id: postedChore[0].id}).then(() => {
        res.json(postedChore);
      })
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
