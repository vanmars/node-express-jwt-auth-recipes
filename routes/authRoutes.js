 const { Router } = require('express');
 const authController = require('../controllers/authController');

 // create new instance of router
 const router = Router();

 // now attach new request handlers
 router.get('/signup', authController.signup_get);
 router.post('/signup', authController.signup_post);
 router.get('/login', authController.login_get);
 router.post('/login', authController.login_post);
 router.get('/logout', authController.logout_get);

 module.exports = router;