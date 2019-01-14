const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/User');
const secretKey = require('../config/keys')

//Registration Post
router.post('/register', (req, res) => {
  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: "email already exist" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//Login Route
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Users.findOne({ email }).then(user => {
    if (!user) {
      res.status(404).json({ email: "Email already exist" })
    } else {
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email
            }
            jwt.sign(payload, secretKey.jwtSecretKey, { expiresIn: 604800 }, (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                token: 'Bearer' + token
              })
            })
          } else {
            res.status(400).json({ password: "Incorrect Password" })
          }
        }).catch(err => console.log(err))
    }
  })
})

module.exports = router;