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

async function getBorrowings() {
  return borrowingModel.findAll();
}

async function createBorrowing(data) {
  const record = normalizeRecord(data);
  const errors = validateBorrowingData(record);
  const book = await bookModel.findById(record.bookId);
  if (!book) errors.push('Book not found');
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return borrowingModel.create(record);
}

async function updateBorrowing(id, data) {
  const existing = await borrowingModel.findById(id);
  if (!existing) {
    const error = new Error('Borrowing record not found');
    error.status = 404;
    throw error;
  }
  const record = normalizeRecord(data);
  const errors = validateBorrowingData(record);
  const book = await bookModel.findById(record.bookId);
  if (!book) errors.push('Book not found');
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }
  return borrowingModel.update(id, record);
}

async function deleteBorrowing(id) {
  const existing = await borrowingModel.findById(id);
  if (!existing) {
    const error = new Error('Borrowing record not found');
    error.status = 404;
    throw error;
  }
  await borrowingModel.remove(id);
  return { message: 'Borrowing record deleted successfully' };
}

module.exports = { getBorrowings, createBorrowing, updateBorrowing, deleteBorrowing };
