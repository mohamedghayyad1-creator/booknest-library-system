const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200: { description: List of categories }
 *   post:
 *     summary: Create category
 *     responses:
 *       201: { description: Category created }
 */
router.get('/', controller.getCategories);
router.post('/', controller.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     responses:
 *       200: { description: Category updated }
 *   delete:
 *     summary: Delete category
 *     responses:
 *       200: { description: Category deleted }
 */
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
