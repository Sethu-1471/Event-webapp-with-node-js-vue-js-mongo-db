var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/UserReg');
const setting = require('../config/setting') // get settings file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = setting.secret;
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({
        _id: jwt_payload.id
    }, function(err, user) {
            if (err) {
              return done(err, false);
          }
        if (user) {
              done(null, user);
            } else {
                done(null, false);
          }
      });
  }));
};