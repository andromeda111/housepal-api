const express = require('express');
const router = express.Router();
const db = require('../db')
const bcrypt = require('bcrypt-as-promised');

// require('./config/passport')(passport);



/* Login */
router.post('/login', function(req, res, next) {


});

/* Signup */
router.post('/signup', function(req, res, next) {

    var newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    console.log('before bcrypt ', newUser.password);

    // save the user
    // newUser.save(function(err) {
    //   if (err) {
    //     return res.json({success: false, msg: 'Username already exists.'});
    //   }
      // res.json({success: true, msg: 'Successful created new user.'});
    // });


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


function bcryptStuff() {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
}

module.exports = router;
