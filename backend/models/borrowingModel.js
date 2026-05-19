const { run, get, all } = require('../database/db');

function findAll(userId) {
  return all(`SELECT br.*, b.title as book_title
    FROM borrowings br
    JOIN books b ON br.book_id = b.id AND b.user_id = br.user_id
    WHERE br.user_id = ?
    ORDER BY br.id DESC`, [userId]);
}

function findById(id, userId) {
  return get(`SELECT br.*, b.title as book_title
    FROM borrowings br
    JOIN books b ON br.book_id = b.id AND b.user_id = br.user_id
    WHERE br.id = ? AND br.user_id = ?`, [id, userId]);
}

async function create(userId, record) {
  const result = await run(`INSERT INTO borrowings (user_id, book_id, borrower_name, borrow_date, return_date, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, record.bookId, record.borrowerName, record.borrowDate, record.returnDate || '', record.status || 'Borrowed', record.notes || '']);
  return findById(result.id, userId);
}

async function update(id, userId, record) {
  await run(`UPDATE borrowings SET book_id = ?, borrower_name = ?, borrow_date = ?, return_date = ?, status = ?, notes = ? WHERE id = ? AND user_id = ?`,
    [record.bookId, record.borrowerName, record.borrowDate, record.returnDate || '', record.status || 'Borrowed', record.notes || '', id, userId]);
  return findById(id, userId);
}

function remove(id, userId) {
  return run('DELETE FROM borrowings WHERE id = ? AND user_id = ?', [id, userId]);
}

module.exports = { findAll, findById, create, update, remove };
