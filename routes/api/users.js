const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateFacebookLogin = require('../../validation/loginFacebook');

// Load User model
const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        favoris: [],
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    });
  });
});

router.post('/login/facebook', async (req, res) => {
  // Check validation
  if (req.body.isLogged != true) {
    return res.status(400).json({ msg: 'Pas de connexion' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;

  try {
    let user = await User.findOne({ email });
    const userFields = {
      id: user.id,
      name: user.name,
      userID: req.body.userID,
      name: req.body.name,
      picture: req.body.picture,
      favoris: user.favoris,
    };
    if (user) {
      try {
        let userF = await User.findOneAndUpdate(
          { user: user.id },
          { $set: userFields },
          { new: true, upsert: false }
        );

        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  // Find user by email
});

router.post('/favoris', async (req, res) => {
  // Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const profileFields = { favoris: [req.body.selected, req.body.selected2] };
  try {
    let user = User.findOne(email);
    if (user) {
      try {
        user = await User.findOneAndUpdate(
          { user: user.id },
          { $set: profileFields },
          { new: true, upsert: false, overwrite: true }
        );

        user.save();

        res.json(user);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/live', async (req, res) => {
  // Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const liveFields = { liveSelected: [req.body.live] };
  try {
    let user = User.findOne(email);
    if (user) {
      try {
        user = await User.findOneAndUpdate(
          { user: user.id },
          { $set: liveFields },
          { new: true, upsert: false, overwrite: true }
        );

        user.save();

        res.json(user);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/me', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.id,
    });

    if (!user) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    // only populate from user document if profile exists
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
