const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  //Checking for username and password being filled
  if (username == '' || password == '') {
    res.render('auth/signup',
      { errorMessage: 'Indicate username and password' })
    return;
  }
  // password strength -- regular expression
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (passwordRegex.test(password) === false) {
    res.render('auth/signup',
      { errorMessage: 'Password is too weak' })
    return;
  }
  // Check if the user already exists
  let user = await User.findOne({ username: username });
  if (user !== null) {
    res.render('auth/signup',
      { errorMessage: 'Username already exists' })
    return;
  }

  user = await User.findOne({ email: email });
  if (user !== null) {
    res.render('auth/signup',
      { errorMessage: 'email already exists' })
    return;
  }
  //Create the user in the database
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try{
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.redirect('/');
  } catch(e){
    res.render('auth/signup',
      { errorMessage: 'Error occured' })
    return;
  }
 
});

module.exports = router;