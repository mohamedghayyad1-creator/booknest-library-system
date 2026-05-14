const { run, get, all } = require('../database/db');

function findAll() {
  return all(`SELECT br.*, b.title as book_title FROM borrowings br JOIN books b ON br.book_id = b.id ORDER BY br.id DESC`);
}

function findById(id) {
  return get(`SELECT br.*, b.title as book_title FROM borrowings br JOIN books b ON br.book_id = b.id WHERE br.id = ?`, [id]);
}

async function create(record) {
  const result = await run(`INSERT INTO borrowings (book_id, borrower_name, borrow_date, return_date, status, notes) VALUES (?, ?, ?, ?, ?, ?)`,
    [record.bookId, record.borrowerName, record.borrowDate, record.returnDate || '', record.status || 'Borrowed', record.notes || '']);
  return findById(result.id);
}

async function update(id, record) {
  await run(`UPDATE borrowings SET book_id = ?, borrower_name = ?, borrow_date = ?, return_date = ?, status = ?, notes = ? WHERE id = ?`,
    [record.bookId, record.borrowerName, record.borrowDate, record.returnDate || '', record.status || 'Borrowed', record.notes || '', id]);
  return findById(id);
}

function remove(id) {
  return run('DELETE FROM borrowings WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
