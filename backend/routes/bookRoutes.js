const express = require('express');
const controller = require('../controllers/bookController');

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: priority
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of books
 *   post:
 *     summary: Create a new book
 *     responses:
 *       201:
 *         description: Book created
 */
router.get('/', controller.getBooks);
router.post('/', controller.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: One book
 *   put:
 *     summary: Update a book
 *     responses:
 *       200:
 *         description: Book updated
 *   delete:
 *     summary: Delete a book
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.get('/:id', controller.getBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;
