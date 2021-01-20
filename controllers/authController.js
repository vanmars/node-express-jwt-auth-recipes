const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code)  // All errors come with a message property; most of the time err.code will be undefined, but will be defined when required not met
  let errors = { email: '', password: '' };

  // Incorrect email
  if (err.message === 'Incorrect email.') {
    errors.email = 'That email is not registered.'
  }

  // Incorrect password
  if (err.message === 'Incorrect password.') {
    errors.password = 'That password is incorrect.'
  }

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = 'That email is already registered.';
    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// Create JWT Token Function
const maxAge= 3 * 24 * 60 * 60                      // three days
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {     //takes three args: payload obj, secret, options object where you can set expiration
    expiresIn: maxAge                               // expects a time in seconds
  });
}


module.exports.signup_get = (req,res) => {
  res.render('signup');
};

module.exports.login_get = (req,res) => {
  res.render('login');
}

module.exports.signup_post = async (req,res) => {
  const { email, password } = req.body;
  try {
    // create new user
    const user = await User.create( { email, password } ); // Async Task; returns a Promise
    // create new jwt token
    const token = createToken(user._id);
    // store token in a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})    // name, payload, options (cookies sets age in miliseconds not seconds) 
    res.status(201).json({user: user._id});
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req,res) => {
  const { email, password } = req.body;

  try {
    // login
    const user = await User.login(email, password);
    // create new jwt token
    const token = createToken(user._id);
    // store token in a cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})  
    res.status(200).json({ user: user._id })
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}