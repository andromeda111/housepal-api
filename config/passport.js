const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db')

module.exports = function(passport) {
  console.log('in Passport.js file');

  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = process.env.JWT_SECRET;
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
