'use strict';
//I like the split of this into a separate file, same with signin

const User = require('../models/User');
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
    newUser.basic.name = req.body.name;
    newUser.basic.email = req.body.email;
    newUser.profilePic = req.body.profilePic;
    newUser.generateHash(req.body.password)
    .then(newUser => newUser.save()) // http error for duplicated username here
    .then(newUser => newUser.generateToken())
    .then(token => resolve({user: {username: newUser.username, name: newUser.basic.name, email: newUser.basic.email, following: newUser.following, profilePic: newUser.profilePic}, token}))
    .catch(err => reject(err));
  });
};

module.exports = signup;
