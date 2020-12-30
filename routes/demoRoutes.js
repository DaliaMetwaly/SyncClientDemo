const express = require('express');

const router = express.Router();
const demoController = require('../controllers/demoController');
// const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

// // Only admin have permission to access for the below APIs
// router.use(authController.restrictTo('super_admin'));
router.get('/login', demoController.login);
router.get('/sync', demoController.sync);
router.post('/insert', demoController.insert);
router.post('/delete', demoController.delete);
router.post('/update', demoController.update);
router.get('/gettransactions', demoController.getTransactions);
router.get('/getrecords', demoController.getRecords);
router.put('/putactivity', demoController.putActivity);
module.exports = router;
