const categoryService = require('../services/categoryService');

function handleError(res, error) {
  res.status(error.status || 500).json({ error: error.message || 'Server error' });
}

async function getCategories(req, res) {
  try { res.json(await categoryService.getCategories(req.user.id)); } catch (error) { handleError(res, error); }
}
async function createCategory(req, res) {
  try { res.status(201).json(await categoryService.createCategory(req.user.id, req.body)); } catch (error) { handleError(res, error); }
}
async function updateCategory(req, res) {
  try { res.json(await categoryService.updateCategory(req.user.id, req.params.id, req.body)); } catch (error) { handleError(res, error); }
}
async function deleteCategory(req, res) {
  try { res.json(await categoryService.deleteCategory(req.user.id, req.params.id)); } catch (error) { handleError(res, error); }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
