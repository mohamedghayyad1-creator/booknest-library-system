const borrowingModel = require('../models/borrowingModel');
const bookModel = require('../models/bookModel');
const { validateBorrowingData } = require('../utils/bookLogic');

function normalizeRecord(data) {
  return {
    bookId: data.bookId || data.book_id,
    borrowerName: String(data.borrowerName || data.borrower_name || '').trim(),
    borrowDate: data.borrowDate || data.borrow_date,
    returnDate: data.returnDate || data.return_date || '',
    status: data.status || 'Borrowed',
    notes: data.notes || ''
  };
}

async function getBorrowings(userId) {
  return borrowingModel.findAll(userId);
}

async function createBorrowing(userId, data) {
  const record = normalizeRecord(data);
  const errors = validateBorrowingData(record);
  const book = await bookModel.findById(record.bookId, userId);
  if (!book) errors.push('Book not found for this user');
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return borrowingModel.create(userId, record);
}

async function updateBorrowing(userId, id, data) {
  const existing = await borrowingModel.findById(id, userId);
  if (!existing) {
    const error = new Error('Borrowing record not found');
    error.status = 404;
    throw error;
  }
  const record = normalizeRecord(data);
  const errors = validateBorrowingData(record);
  const book = await bookModel.findById(record.bookId, userId);
  if (!book) errors.push('Book not found for this user');
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return borrowingModel.update(id, userId, record);
}

async function deleteBorrowing(userId, id) {
  const existing = await borrowingModel.findById(id, userId);
  if (!existing) {
    const error = new Error('Borrowing record not found');
    error.status = 404;
    throw error;
  }
  await borrowingModel.remove(id, userId);
  return { message: 'Borrowing record deleted successfully' };
}

module.exports = { getBorrowings, createBorrowing, updateBorrowing, deleteBorrowing };
