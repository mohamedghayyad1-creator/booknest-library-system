const { run, get, all } = require('../database/db');

function findAll(userId) {
  return all('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC', [userId]);
}

function findById(id, userId) {
  return get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
}

function findByName(userId, name) {
  return get('SELECT * FROM categories WHERE user_id = ? AND LOWER(name) = LOWER(?)', [userId, name.trim()]);
}

async function create(userId, category) {
  const existing = await findByName(userId, category.name);
  if (existing) return existing;

  const result = await run('INSERT INTO categories (user_id, name) VALUES (?, ?)', [userId, category.name.trim()]);
  return findById(result.id, userId);
}

async function update(id, userId, category) {
  await run('UPDATE categories SET name = ? WHERE id = ? AND user_id = ?', [category.name.trim(), id, userId]);
  return findById(id, userId);
}

function remove(id, userId) {
  return run('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
}

module.exports = { findAll, findById, findByName, create, update, remove };
