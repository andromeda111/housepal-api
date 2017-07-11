const express = require('express');
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt-as-promised');
const passport	= require('passport');
const jwt         = require('jwt-simple');

router.post('/login', function(req, res) {
  var loginEmail = req.body.email

  db('users').where({email: loginEmail})
  .then(user => {
    console.log(user[0].h_pw);
    return bcrypt.compare(req.body.password, user[0].h_pw).then(result => {
        var token = jwt.encode(user[0], process.env.JWT_SECRET);
        console.log('token: ', token);
        res.json({success: true, token: 'JWT ' + token});
      }).catch(err => {
        console.error(err);
      })
  })
});

/* Signup */
router.post('/signup', function(req, res, next) {

    const { name, email, password } = req.body;

    bcrypt.hash(password, 12)
      .then((h_pw) => {
        return db('users').insert({
          name,
          email,
          h_pw
        }, '*');
      })
      .then((users) => {
        const user = users[0];
        console.log('new user created and stored: ', user);
        res.json({success: true, msg: 'Successful created new user.'});
      })
      // .catch((err) => {
      //   next(err);
      // });

});

module.exports = router;
