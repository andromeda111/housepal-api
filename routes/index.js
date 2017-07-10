const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const config = require('../config/database');
var passport	= require('passport');
require('../config/passport')(passport);


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

router.get('/list', function(req, res, next) {
  db('shopping-list-items').then(result => {
    console.log('Hitting route ', result);
    res.json(result);
  })
});

router.put('/list/:id', function(req, res, next) {
  const id = req.params.id
  const item = req.body
  console.log('router req.body: ', item);
  db('shopping-list-items').where({id: id}).update({buyer: item.buyer})
  .then((updatedItem) => {
    res.status(200).json(req.body)
  })
});

router.delete('/list/:id', function(req, res, next) {
  const id = req.params.id
  console.log('router id: ', id);
  db('shopping-list-items').where({id: id}).del().returning('*')
  .then((thisItem) => {
    res.status(210).json(thisItem)
  })
});

// MEMBER INFO TEST ROUTE
router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);

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
    var parted = headers.authorization.split(' ');
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
