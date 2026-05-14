const { run, get, all } = require('../database/db');

function findAll() {
  return all('SELECT * FROM categories ORDER BY name ASC');
}

function findById(id) {
  return get('SELECT * FROM categories WHERE id = ?', [id]);
}

async function create(category) {
  const result = await run('INSERT INTO categories (name) VALUES (?)', [category.name.trim()]);
  return findById(result.id);
}

async function update(id, category) {
  await run('UPDATE categories SET name = ? WHERE id = ?', [category.name.trim(), id]);
  return findById(id);
}

function remove(id) {
  return run('DELETE FROM categories WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
