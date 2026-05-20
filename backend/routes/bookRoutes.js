const express = require('express');
const controller = require('../controllers/bookController');

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books for the logged-in user
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new book for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - totalPages
 *               - status
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               author:
 *                 type: string
 *                 example: Robert C. Martin
 *               categoryId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               isbn:
 *                 type: string
 *                 example: 9780132350884
 *               totalPages:
 *                 type: integer
 *                 example: 464
 *               currentPage:
 *                 type: integer
 *                 example: 120
 *               status:
 *                 type: string
 *                 example: Reading
 *               priority:
 *                 type: string
 *                 example: High
 *               rating:
 *                 type: integer
 *                 example: 5
 *               notes:
 *                 type: string
 *                 example: Important programming book
 *               startDate:
 *                 type: string
 *                 example: 2026-05-20
 *               finishDate:
 *                 type: string
 *                 example: ''
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid book data
 *       401:
 *         description: Unauthorized
 */
router.get('/', controller.getBooks);
router.post('/', controller.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get one book owned by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: One book
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *   put:
 *     summary: Update a book owned by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - totalPages
 *               - status
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               author:
 *                 type: string
 *                 example: Robert C. Martin
 *               categoryId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               isbn:
 *                 type: string
 *                 example: 9780132350884
 *               totalPages:
 *                 type: integer
 *                 example: 464
 *               currentPage:
 *                 type: integer
 *                 example: 200
 *               status:
 *                 type: string
 *                 example: Reading
 *               priority:
 *                 type: string
 *                 example: High
 *               rating:
 *                 type: integer
 *                 example: 5
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *               startDate:
 *                 type: string
 *                 example: 2026-05-20
 *               finishDate:
 *                 type: string
 *                 example: ''
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Invalid book data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete a book owned by the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Book deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.get('/:id', controller.getBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;
