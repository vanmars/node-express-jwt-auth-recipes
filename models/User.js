const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email.'] // val is whatever the user inputs
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: [6, 'Minimum password length is 6 characters.']
  }
})

// fire a function before doc saved to db
userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email }); // search db with inputted email; if no user, will return undefined
  if (user) {
    const auth = await bcrypt.compare(password, user.password) //comparing the password a user signs in with, with the hashed password stored in database
    if (auth) {
      return user   // if successful, we will return the user
    }
    throw Error ('Incorrect password.') // reaches this block if password is not correct
  }
  throw Error('Incorrect email.')
}


const User = mongoose.model('user', userSchema) // Under the hood, mongoose will look for plural version in our collection and connect this model to the database

module.exports = User;