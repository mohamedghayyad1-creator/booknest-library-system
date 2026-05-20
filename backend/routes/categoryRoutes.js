const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new category for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid category data
 *       401:
 *         description: Unauthorized
 */
router.get('/', controller.getCategories);
router.post('/', controller.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category owned by the logged-in user
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: University
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid category data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category owned by the logged-in user
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
 *         description: Category deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
