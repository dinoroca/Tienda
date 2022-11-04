'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'H0K4w4Ti3nd4';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, secret);
}