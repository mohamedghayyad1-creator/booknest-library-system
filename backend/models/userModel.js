const { run, get } = require('../database/db');

function findByEmail(email) {
  return get('SELECT * FROM users WHERE email = ?', [email]);
}

function findById(id) {
  return get('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
}

async function create(user) {
  const result = await run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password]);
  return findById(result.id);
}

module.exports = { findByEmail, findById, create };
