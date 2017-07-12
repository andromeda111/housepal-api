const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cp-server' });
});

router.get('/data', function(req, res, next) {
  db('houses').then(result => {
    res.json(result);
  })
});

router.get('/list', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('shopping_list_items').where({house_id: decoded.house_id}).then(result => {
      console.log('Hitting route ', result);
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/list', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('router: body', req.body.newItem);
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let newItem = {item: req.body.newItem, house_id: decoded.house_id}
    db('shopping_list_items').insert(newItem).returning('*').then(result => {
      console.log('Hitting route ', result);
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }

});

router.put('/list/:id', function(req, res, next) {
  const id = req.params.id
  let buyer;
  !req.body.buyer ? buyer = '' : buyer = req.body.buyer.name

  db('shopping_list_items').where({id}).update({buyer})
  .then((updatedItem) => {
    res.status(200).json(req.body)
  })
});

router.delete('/list/:id', function(req, res, next) {
  const id = req.params.id
  console.log('router id: ', id);
  db('shopping_list_items').where({id: id}).del().returning('*')
  .then((thisItem) => {
    res.status(210).json(thisItem)
  })
});

router.get('/users', passport.authenticate('jwt', { session: false}), function(req, res, next) {
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
