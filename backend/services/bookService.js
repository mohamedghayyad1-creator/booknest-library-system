const bookModel = require('../models/bookModel');
const categoryModel = require('../models/categoryModel');
const { calculateProgress, validateBookData } = require('../utils/bookLogic');

function normalizeBookData(data) {
  return {
    title: String(data.title || '').trim(),
    author: String(data.author || '').trim(),
    categoryId: data.categoryId || data.category_id || null,
    isbn: String(data.isbn || '').trim(),
    totalPages: Number(data.totalPages || data.total_pages),
    currentPage: Number(data.currentPage || data.current_page || 0),
    status: data.status,
    priority: data.priority,
    rating: data.rating === '' ? null : data.rating,
    notes: data.notes || '',
    startDate: data.startDate || data.start_date || '',
    finishDate: data.finishDate || data.finish_date || ''
  };
}

async function validateCategoryOwnership(userId, categoryId) {
  if (!categoryId) return;
  const category = await categoryModel.findById(categoryId, userId);
  if (!category) {
    const error = new Error('Category not found for this user');
    error.status = 400;
    throw error;
  }
}

async function getBooks(userId, filters) {
  return bookModel.findAll(userId, filters);
}

async function getBook(userId, id) {
  const book = await bookModel.findById(id, userId);
  if (!book) {
    const error = new Error('Book not found');
    error.status = 404;
    throw error;
  }
  return book;
}

async function createBook(userId, data) {
  const book = normalizeBookData(data);
  const errors = validateBookData(book);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  await validateCategoryOwnership(userId, book.categoryId);
  book.progress = calculateProgress(book.currentPage, book.totalPages);
  return bookModel.create(userId, book);
}

async function updateBook(userId, id, data) {
  await getBook(userId, id);
  const book = normalizeBookData(data);
  const errors = validateBookData(book);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  await validateCategoryOwnership(userId, book.categoryId);
  book.progress = calculateProgress(book.currentPage, book.totalPages);
  return bookModel.update(id, userId, book);
}

async function deleteBook(userId, id) {
  await getBook(userId, id);
  await bookModel.remove(id, userId);
  return { message: 'Book deleted successfully' };
}

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
