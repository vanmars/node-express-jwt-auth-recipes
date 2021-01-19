const User = require('../models/User');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code)  // All errors come with a message property; most of the time err.code will be undefined, but will be defined when required not met
  let errors = { email: '', password: '' };

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

module.exports.signup_get = (req,res) => {
  res.render('signup');
};

module.exports.login_get = (req,res) => {
  res.render('login');
}

module.exports.signup_post = async (req,res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create( { email, password } ) // Async Task; returns a Promise
    res.status(201).json(user)
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req,res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.send('new login');
}
