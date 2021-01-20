const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {   // inside any middle ware, we get the response, request, and next objects
  const token = req.cookies.jwt;

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => { // use verfiy method from jwt library, first arg is token and second is the original secret we used
      if (err) {
        console.log(err.message);
        res.redirect('/');
      } else {
        console.log(decodedToken)
        next();
      }
    })
  } else {
    res.redirect('/');
  }
}

module.exports = { requireAuth };