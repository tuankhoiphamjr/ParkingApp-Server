const db = require('../models');
var bcrypt = require("bcryptjs");
const User = db.user;

exports.createUser = async (phoneNumber, password, role) => {
    const newUser = new User({
        phoneNumber: phoneNumber,
        password: bcrypt.hashSync(password, 8),
        role : role,
      });
    
      newUser.save((err, user) => {
        if (err) {
          return {message: err, status: false};
        }
        return ({ message: "User was registered successfully!", status: true});
      });
}