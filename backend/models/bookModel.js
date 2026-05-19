const { run, get, all } = require('../database/db');

async function findAll(userId, filters = {}) {
  const conditions = ['b.user_id = ?'];
  const params = [userId];

  if (filters.search) {
    conditions.push('(LOWER(b.title) LIKE ? OR LOWER(b.author) LIKE ? OR LOWER(b.isbn) LIKE ?)');
    const value = `%${filters.search.toLowerCase()}%`;
    params.push(value, value, value);
  }
  if (filters.categoryId) {
    conditions.push('b.category_id = ?');
    params.push(filters.categoryId);
  }
  if (filters.status) {
    conditions.push('b.status = ?');
    params.push(filters.status);
  }
  if (filters.priority) {
    conditions.push('b.priority = ?');
    params.push(filters.priority);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;
  return all(`SELECT b.*, c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id AND c.user_id = b.user_id
    ${where}
    ORDER BY b.id DESC`, params);
}

function findById(id, userId) {
  return get(`SELECT b.*, c.name as category_name
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id AND c.user_id = b.user_id
    WHERE b.id = ? AND b.user_id = ?`, [id, userId]);
}

async function create(userId, book) {
  const result = await run(`INSERT INTO books
    (user_id, title, author, category_id, isbn, total_pages, current_page, progress, status, priority, rating, notes, start_date, finish_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, book.title, book.author, book.categoryId || null, book.isbn || '', book.totalPages, book.currentPage, book.progress, book.status, book.priority, book.rating || null, book.notes || '', book.startDate || '', book.finishDate || '']);
  return findById(result.id, userId);
}

async function update(id, userId, book) {
  await run(`UPDATE books SET
    title = ?, author = ?, category_id = ?, isbn = ?, total_pages = ?, current_page = ?, progress = ?, status = ?, priority = ?, rating = ?, notes = ?, start_date = ?, finish_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?`,
    [book.title, book.author, book.categoryId || null, book.isbn || '', book.totalPages, book.currentPage, book.progress, book.status, book.priority, book.rating || null, book.notes || '', book.startDate || '', book.finishDate || '', id, userId]);
  return findById(id, userId);
}

async function remove(id, userId) {
  return run('DELETE FROM books WHERE id = ? AND user_id = ?', [id, userId]);
}

module.exports = { findAll, findById, create, update, remove };
