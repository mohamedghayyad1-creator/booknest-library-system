const express = require('express');
const controller = require('../controllers/borrowingController');

const router = express.Router();

/**
 * @swagger
 * /api/borrowings:
 *   get:
 *     summary: Get all borrowing records for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowing records
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a borrowing record for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - borrowerName
 *               - borrowDate
 *               - status
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               borrowerName:
 *                 type: string
 *                 example: Ahmed
 *               borrowDate:
 *                 type: string
 *                 example: 2026-05-20
 *               returnDate:
 *                 type: string
 *                 example: 2026-05-30
 *               status:
 *                 type: string
 *                 example: Borrowed
 *               notes:
 *                 type: string
 *                 example: Return next week
 *     responses:
 *       201:
 *         description: Borrowing record created
 *       400:
 *         description: Invalid borrowing data
 *       401:
 *         description: Unauthorized
 */
router.get('/', controller.getBorrowings);
router.post('/', controller.createBorrowing);

/**
 * @swagger
 * /api/borrowings/{id}:
 *   put:
 *     summary: Update a borrowing record owned by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - borrowerName
 *               - borrowDate
 *               - status
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               borrowerName:
 *                 type: string
 *                 example: Ahmed
 *               borrowDate:
 *                 type: string
 *                 example: 2026-05-20
 *               returnDate:
 *                 type: string
 *                 example: 2026-05-30
 *               status:
 *                 type: string
 *                 example: Returned
 *               notes:
 *                 type: string
 *                 example: Returned successfully
 *     responses:
 *       200:
 *         description: Borrowing record updated
 *       400:
 *         description: Invalid borrowing data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing record not found
 *   delete:
 *     summary: Delete a borrowing record owned by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borrowing record deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowing record not found
 */
router.put('/:id', controller.updateBorrowing);
router.delete('/:id', controller.deleteBorrowing);

module.exports = router;
