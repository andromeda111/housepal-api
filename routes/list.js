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
    db('shopping_list_items').where({house_id: decoded.house_id}).then(result => {
      console.log('Hitting route ', result);
      res.json(result);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
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

router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  const id = req.params.id
  let buyer;
  !req.body.buyer ? buyer = '' : buyer = req.body.buyer.name

  db('shopping_list_items').where({id}).update({buyer})
  .then((updatedItem) => {
    res.status(200).json(req.body)
  })
});

router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  const id = req.params.id
  console.log('router id: ', id);
  db('shopping_list_items').where({id: id}).del().returning('*')
  .then((thisItem) => {
    res.status(210).json(thisItem)
  })
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
