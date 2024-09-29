const express = require('express');
const router = express.Router();     // create an object (route) from express's Router method
const authController = require('../controllers/authController');

//Creating a route for login page

router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser);

module.exports = router;
//exporting to server.js bcz of main file, we call each route from server.js









// router variable allow us to make routes