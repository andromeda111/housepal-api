const express = require('express');
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt-as-promised');
var passport	= require('passport');
var config      = require('../config/database');
var jwt         = require('jwt-simple');
// require('./config/passport')(passport);


router.post('/login', function(req, res) {
  var loginEmail = req.body.email

  db('users').where({email: loginEmail})
  .then(user => {
    console.log(user[0].h_pw);
    return bcrypt.compare(req.body.password, user[0].h_pw).then(result => {
        var token = jwt.encode(user[0], config.secret);
        console.log('token: ', token);
        res.json({success: true, token: 'JWT ' + token});
      }).catch(err => {
        console.error(err);
      })
  })
});



// /* Login */
// router.post('/login', function(req, res, next) {
//
//
// });

/* Signup */
router.post('/signup', function(req, res, next) {

    // ////////////////////
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

        // const claim = { userId: user.id };
        // const token = jwt.sign(claim, process.env.JWT_KEY, {
        //   expiresIn: '7 days'
        // });
        //
        // res.cookie('token', token, {
        //   httpOnly: true,
        //   expires: new Date(Date.now() + 1000 * 60 * 60 * 30), // 30 days
        //   secure: router.get('env') === 'production'
        // });
        //
        // delete user.h_pw;
        //
        // res.send(user);
      })
      // .catch((err) => {
      //   next(err);
      // });

});


module.exports = router;
