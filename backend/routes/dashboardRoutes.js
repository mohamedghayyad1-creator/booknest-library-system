const express = require('express');
const controller = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     responses:
 *       200: { description: Dashboard statistics }
 */
router.get('/', controller.getDashboard);

module.exports = router;
