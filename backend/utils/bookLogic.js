const allowedStatuses = ['Want to Read', 'Reading', 'Completed', 'On Hold', 'Borrowed'];
const allowedPriorities = ['Low', 'Medium', 'High'];
const borrowingStatuses = ['Borrowed', 'Returned'];

function calculateProgress(currentPage, totalPages) {
  const current = Number(currentPage);
  const total = Number(totalPages);
  if (!Number.isFinite(current) || !Number.isFinite(total) || total <= 0) return 0;
  const progress = Math.round((current / total) * 100);
  return Math.max(0, Math.min(progress, 100));
}

function validateBookData(book) {
  const errors = [];
  if (!book.title || String(book.title).trim().length < 2) errors.push('Title must be at least 2 characters');
  if (!book.author || String(book.author).trim().length < 2) errors.push('Author must be at least 2 characters');
  if (!book.totalPages || Number(book.totalPages) <= 0) errors.push('Total pages must be greater than 0');
  if (Number(book.currentPage) < 0) errors.push('Current page cannot be negative');
  if (Number(book.currentPage) > Number(book.totalPages)) errors.push('Current page cannot be greater than total pages');
  if (!allowedStatuses.includes(book.status)) errors.push('Invalid reading status');
  if (!allowedPriorities.includes(book.priority)) errors.push('Invalid priority');
  if (book.rating !== undefined && book.rating !== null && book.rating !== '' && (Number(book.rating) < 1 || Number(book.rating) > 5)) errors.push('Rating must be between 1 and 5');
  return errors;
}

function validateCategoryData(category) {
  const errors = [];
  if (!category.name || String(category.name).trim().length < 2) errors.push('Category name must be at least 2 characters');
  return errors;
}

function validateBorrowingData(record) {
  const errors = [];
  if (!record.bookId && !record.book_id) errors.push('Book is required');
  if (!record.borrowerName && !record.borrower_name) errors.push('Borrower name is required');
  if (!record.borrowDate && !record.borrow_date) errors.push('Borrow date is required');
  if (!borrowingStatuses.includes(record.status || 'Borrowed')) errors.push('Invalid borrowing status');
  return errors;
}

function calculateDashboardStats(books, borrowings) {
  const totalBooks = books.length;
  const reading = books.filter(book => book.status === 'Reading').length;
  const completed = books.filter(book => book.status === 'Completed').length;
  const borrowed = borrowings.filter(record => record.status === 'Borrowed').length;
  const ratedBooks = books.filter(book => Number(book.rating) > 0);
  const averageRating = ratedBooks.length === 0 ? 0 : Number((ratedBooks.reduce((sum, book) => sum + Number(book.rating), 0) / ratedBooks.length).toFixed(1));
  const totalPagesRead = books.reduce((sum, book) => sum + Number(book.current_page || book.currentPage || 0), 0);
  return { totalBooks, reading, completed, borrowed, averageRating, totalPagesRead };
}

module.exports = {
  allowedStatuses,
  allowedPriorities,
  borrowingStatuses,
  calculateProgress,
  validateBookData,
  validateCategoryData,
  validateBorrowingData,
  calculateDashboardStats
};
