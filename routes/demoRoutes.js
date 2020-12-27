const express = require('express');

const router = express.Router();
const demoController = require('../controllers/demoController');
// const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

// // Only admin have permission to access for the below APIs
// router.use(authController.restrictTo('super_admin'));

router.put('/login', demoController.Login);
module.exports = router;
