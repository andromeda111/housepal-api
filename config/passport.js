var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
// var User = require('../app/models/user');
var config = require('../config/database'); // get db config file
const db = require('../db')

// const env = require('./.env') ???

module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    db('users').where({id: jwt_payload.id}).then((user) => {
      if (user) {
          done(null, user);
      } else {
          done(null, false);
      }
    })

  }));
};
