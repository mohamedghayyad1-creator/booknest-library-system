const categoryModel = require('../models/categoryModel');
const { validateCategoryData } = require('../utils/bookLogic');

async function getCategories(userId) {
  return categoryModel.findAll(userId);
}

async function createCategory(userId, data) {
  const errors = validateCategoryData(data);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return categoryModel.create(userId, data);
}

async function updateCategory(userId, id, data) {
  const existing = await categoryModel.findById(id, userId);
  if (!existing) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  const errors = validateCategoryData(data);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return categoryModel.update(id, userId, data);
}

async function deleteCategory(userId, id) {
  const existing = await categoryModel.findById(id, userId);
  if (!existing) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  await categoryModel.remove(id, userId);
  return { message: 'Category deleted successfully' };
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
