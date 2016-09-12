'use strict';

const User = require('../model/User');
const httpError = require('http-errors');

const signup = function(req) {
  return new Promise((resolve, reject) => {
    if(!req.body.username || !req.body.password || !req.body.email) {
      return reject(httpError(400, 'required fields not satisfied'));
    }
    let newUser = new User();
    if (req.body.role)
      newUser.role = req.body.role;
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.generateHash(req.body.password)
    .then(newUser => newUser.save()) // http error for duplicated username here
    .then(newUser => newUser.generateToken())
    .then(token => resolve(token))
    .catch(err => reject(err));
  });
};

module.exports = signup;