const categoryModel = require('../models/categoryModel');
const { validateCategoryData } = require('../utils/bookLogic');

async function getCategories() {
  return categoryModel.findAll();
}

async function createCategory(data) {
  const errors = validateCategoryData(data);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return categoryModel.create(data);
}

async function updateCategory(id, data) {
  const existing = await categoryModel.findById(id);
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
  return categoryModel.update(id, data);
}

async function deleteCategory(id) {
  const existing = await categoryModel.findById(id);
  if (!existing) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  await categoryModel.remove(id);
  return { message: 'Category deleted successfully' };
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
