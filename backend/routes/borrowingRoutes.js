const express = require('express');
const controller = require('../controllers/borrowingController');

const router = express.Router();

/**
 * @swagger
 * /api/borrowings:
 *   get:
 *     summary: Get all borrowing records
 *     responses:
 *       200: { description: List of borrowing records }
 *   post:
 *     summary: Create borrowing record
 *     responses:
 *       201: { description: Borrowing record created }
 */
router.get('/', controller.getBorrowings);
router.post('/', controller.createBorrowing);

/**
 * @swagger
 * /api/borrowings/{id}:
 *   put:
 *     summary: Update borrowing record
 *     responses:
 *       200: { description: Borrowing record updated }
 *   delete:
 *     summary: Delete borrowing record
 *     responses:
 *       200: { description: Borrowing record deleted }
 */
router.put('/:id', controller.updateBorrowing);
router.delete('/:id', controller.deleteBorrowing);

module.exports = router;
