const {
  calculateProgress,
  validateBookData,
  validateCategoryData,
  validateBorrowingData,
  calculateDashboardStats
} = require('../utils/bookLogic');

test('calculates reading progress correctly', () => {
  expect(calculateProgress(50, 200)).toBe(25);
  expect(calculateProgress(300, 300)).toBe(100);
  expect(calculateProgress(400, 300)).toBe(100);
});

test('validates invalid book data', () => {
  const errors = validateBookData({ title: '', author: 'A', totalPages: 0, currentPage: 5, status: 'Bad', priority: 'Wrong', rating: 9 });
  expect(errors.length).toBeGreaterThan(0);
});

test('validates correct book data', () => {
  const errors = validateBookData({ title: 'Clean Code', author: 'Robert Martin', totalPages: 464, currentPage: 120, status: 'Reading', priority: 'High', rating: 5 });
  expect(errors).toHaveLength(0);
});

test('validates category name', () => {
  expect(validateCategoryData({ name: '' }).length).toBeGreaterThan(0);
  expect(validateCategoryData({ name: 'Programming' })).toHaveLength(0);
});

test('validates borrowing record', () => {
  expect(validateBorrowingData({ bookId: 1, borrowerName: 'Ahmed', borrowDate: '2026-05-10', status: 'Borrowed' })).toHaveLength(0);
  expect(validateBorrowingData({ borrowerName: '', status: 'Wrong' }).length).toBeGreaterThan(0);
});

test('calculates dashboard statistics', () => {
  const books = [
    { status: 'Reading', rating: 4, current_page: 100 },
    { status: 'Completed', rating: 5, current_page: 200 }
  ];
  const borrowings = [{ status: 'Borrowed' }, { status: 'Returned' }];
  const stats = calculateDashboardStats(books, borrowings);
  expect(stats.totalBooks).toBe(2);
  expect(stats.reading).toBe(1);
  expect(stats.completed).toBe(1);
  expect(stats.borrowed).toBe(1);
  expect(stats.averageRating).toBe(4.5);
});
