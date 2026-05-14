const bookModel = require('../models/bookModel');
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

async function getBooks(filters) {
  return bookModel.findAll(filters);
}

async function getBook(id) {
  const book = await bookModel.findById(id);
  if (!book) {
    const error = new Error('Book not found');
    error.status = 404;
    throw error;
  }
  return book;
}

async function createBook(data) {
  const book = normalizeBookData(data);
  const errors = validateBookData(book);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  book.progress = calculateProgress(book.currentPage, book.totalPages);
  return bookModel.create(book);
}

async function updateBook(id, data) {
  await getBook(id);
  const book = normalizeBookData(data);
  const errors = validateBookData(book);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  book.progress = calculateProgress(book.currentPage, book.totalPages);
  return bookModel.update(id, book);
}

async function deleteBook(id) {
  await getBook(id);
  await bookModel.remove(id);
  return { message: 'Book deleted successfully' };
}

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
