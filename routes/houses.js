const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);


router.get('/', function(req, res, next) {
  res.send('success');
});

router.post('/join', function(req, res, next) {
  const inputCode = req.body.joinFormCode

  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    db('houses').where({code: inputCode}).then(result => {
      if (!result[0]) {
        res.status(200).send({success: false, msg: 'House does not exist'});
      } else {
        console.log('Successful Match');
        console.log(result);
        let houseId = result[0].id
        console.log('houseId: ', houseId);
        db('users').update({house_id: houseId}).where({id: decoded.id}).returning('*').then(final => {
          console.log('final: ', final);
          console.log(process.env.JWT_SECRET);
          res.status(200).send({success: true, msg: 'House successfully joined'});
        })

      }
    }).catch(err => {
      res.status(200).send({success: false, msg: 'CATCH House does not exist'});
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
