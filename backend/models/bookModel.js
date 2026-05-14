const { run, get, all } = require('../database/db');

async function findAll(filters = {}) {
  const conditions = [];
  const params = [];

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

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return all(`SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id ${where} ORDER BY b.id DESC`, params);
}

function findById(id) {
  return get('SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.id = ?', [id]);
}

async function create(book) {
  const result = await run(`INSERT INTO books
    (title, author, category_id, isbn, total_pages, current_page, progress, status, priority, rating, notes, start_date, finish_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [book.title, book.author, book.categoryId || null, book.isbn || '', book.totalPages, book.currentPage, book.progress, book.status, book.priority, book.rating || null, book.notes || '', book.startDate || '', book.finishDate || '']);
  return findById(result.id);
}

async function update(id, book) {
  await run(`UPDATE books SET
    title = ?, author = ?, category_id = ?, isbn = ?, total_pages = ?, current_page = ?, progress = ?, status = ?, priority = ?, rating = ?, notes = ?, start_date = ?, finish_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [book.title, book.author, book.categoryId || null, book.isbn || '', book.totalPages, book.currentPage, book.progress, book.status, book.priority, book.rating || null, book.notes || '', book.startDate || '', book.finishDate || '', id]);
  return findById(id);
}

async function remove(id) {
  return run('DELETE FROM books WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
