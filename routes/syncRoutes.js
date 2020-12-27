const express = require('express');

const router = express.Router();
const syncController = require('../controllers/syncController');
// const authController = require('../controllers/authController');

// Protect all routes after this middleware
// router.use(authController.protect);

// // Only admin have permission to access for the below APIs
// router.use(authController.restrictTo('super_admin'));

router.put('/putActivity', syncController.putActivity);
router.get('/clientRegisteration', syncController.clientRegisteration);
router.get('/syncApi/:tableName/:entityId/:token/:lastSyncDate*?', syncController.syncApi);
router.get('/transactionSync/:tableName/:entityId/:token/:lastSyncDate/:identifier', syncController.transactionSync);
module.exports = router;
