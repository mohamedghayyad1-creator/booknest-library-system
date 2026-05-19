const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'booknest.db');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function tableExists(tableName) {
  const table = await get("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName]);
  return Boolean(table);
}

async function getTableColumns(tableName) {
  if (!(await tableExists(tableName))) return [];
  return all(`PRAGMA table_info(${tableName})`);
}

async function hasColumn(tableName, columnName) {
  const columns = await getTableColumns(tableName);
  return columns.some((column) => column.name === columnName);
}

async function createUsersTable() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function createCategoriesTable() {
  await run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function createBooksTable() {
  await run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category_id INTEGER,
    isbn TEXT,
    total_pages INTEGER NOT NULL,
    current_page INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    rating INTEGER,
    notes TEXT,
    start_date TEXT,
    finish_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function createBorrowingsTable() {
  await run(`CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER NOT NULL,
    borrower_name TEXT NOT NULL,
    borrow_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT NOT NULL DEFAULT 'Borrowed',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function tableHasBadForeignKey(tableName) {
  if (!(await tableExists(tableName))) return false;
  const foreignKeys = await all(`PRAGMA foreign_key_list(${tableName})`);

  for (const key of foreignKeys) {
    const referencedTable = String(key.table || '');
    const isTemporaryMigrationTable = referencedTable.includes('_old') || referencedTable.includes('_migration_');
    const referencedTableExists = referencedTable ? await tableExists(referencedTable) : true;
    if (isTemporaryMigrationTable || !referencedTableExists) return true;
  }

  return false;
}

async function categoriesNeedRebuild() {
  if (!(await tableExists('categories'))) return false;
  const table = await get("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'categories'");
  const sql = table && table.sql ? table.sql : '';
  const hasOldUniqueName = /UNIQUE\s*\(\s*name\s*\)/i.test(sql) || /name\s+TEXT[^,]*UNIQUE/i.test(sql);
  return hasOldUniqueName || !(await hasColumn('categories', 'user_id'));
}

async function booksNeedRebuild() {
  if (!(await tableExists('books'))) return false;
  return !(await hasColumn('books', 'user_id')) || (await tableHasBadForeignKey('books'));
}

async function borrowingsNeedRebuild() {
  if (!(await tableExists('borrowings'))) return false;
  return !(await hasColumn('borrowings', 'user_id')) || (await tableHasBadForeignKey('borrowings'));
}

async function rebuildCategoriesTable() {
  if (!(await tableExists('categories'))) {
    await createCategoriesTable();
    return;
  }

  const oldTable = `categories_migration_${Date.now()}`;
  const columns = await getTableColumns('categories');
  const names = columns.map((column) => column.name);

  await run(`ALTER TABLE categories RENAME TO ${oldTable}`);
  await createCategoriesTable();

  const selectId = names.includes('id') ? 'id' : 'NULL';
  const selectUserId = names.includes('user_id') ? 'user_id' : 'NULL';
  const selectName = names.includes('name') ? 'name' : "'General'";
  const selectCreatedAt = names.includes('created_at') ? 'created_at' : 'CURRENT_TIMESTAMP';

  await run(`INSERT OR IGNORE INTO categories (id, user_id, name, created_at)
    SELECT ${selectId}, ${selectUserId}, ${selectName}, ${selectCreatedAt}
    FROM ${oldTable}
    WHERE ${selectName} IS NOT NULL AND TRIM(${selectName}) <> ''`);

  await run(`DROP TABLE IF EXISTS ${oldTable}`);
}

async function rebuildBooksTable() {
  if (!(await tableExists('books'))) {
    await createBooksTable();
    return;
  }

  const oldTable = `books_migration_${Date.now()}`;
  const columns = await getTableColumns('books');
  const names = columns.map((column) => column.name);
  const value = (name, fallback) => names.includes(name) ? name : fallback;

  await run(`ALTER TABLE books RENAME TO ${oldTable}`);
  await createBooksTable();

  await run(`INSERT OR IGNORE INTO books (
      id, user_id, title, author, category_id, isbn, total_pages, current_page,
      progress, status, priority, rating, notes, start_date, finish_date, created_at, updated_at
    )
    SELECT
      ${value('id', 'NULL')},
      ${value('user_id', 'NULL')},
      ${value('title', "'Untitled'")},
      ${value('author', "'Unknown'")},
      ${value('category_id', 'NULL')},
      ${value('isbn', "''")},
      ${value('total_pages', '1')},
      ${value('current_page', '0')},
      ${value('progress', '0')},
      ${value('status', "'Want to Read'")},
      ${value('priority', "'Medium'")},
      ${value('rating', 'NULL')},
      ${value('notes', "''")},
      ${value('start_date', "''")},
      ${value('finish_date', "''")},
      ${value('created_at', 'CURRENT_TIMESTAMP')},
      ${value('updated_at', 'CURRENT_TIMESTAMP')}
    FROM ${oldTable}`);

  await run(`DROP TABLE IF EXISTS ${oldTable}`);
}

async function rebuildBorrowingsTable() {
  if (!(await tableExists('borrowings'))) {
    await createBorrowingsTable();
    return;
  }

  const oldTable = `borrowings_migration_${Date.now()}`;
  const columns = await getTableColumns('borrowings');
  const names = columns.map((column) => column.name);
  const value = (name, fallback) => names.includes(name) ? name : fallback;

  await run(`ALTER TABLE borrowings RENAME TO ${oldTable}`);
  await createBorrowingsTable();

  await run(`INSERT OR IGNORE INTO borrowings (
      id, user_id, book_id, borrower_name, borrow_date, return_date, status, notes, created_at
    )
    SELECT
      ${value('id', 'NULL')},
      ${value('user_id', 'NULL')},
      ${value('book_id', 'NULL')},
      ${value('borrower_name', "'Unknown'")},
      ${value('borrow_date', "''")},
      ${value('return_date', "''")},
      ${value('status', "'Borrowed'")},
      ${value('notes', "''")},
      ${value('created_at', 'CURRENT_TIMESTAMP')}
    FROM ${oldTable}
    WHERE ${value('book_id', 'NULL')} IS NOT NULL`);

  await run(`DROP TABLE IF EXISTS ${oldTable}`);
}

async function removeDuplicateCategories() {
  if (!(await tableExists('categories'))) return;
  await run(`DELETE FROM categories
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM categories
      GROUP BY COALESCE(user_id, -1), LOWER(TRIM(name))
    )`);
}

async function initializeDatabase() {
  await run('PRAGMA foreign_keys = OFF');

  await createUsersTable();

  if (await categoriesNeedRebuild()) await rebuildCategoriesTable();
  else await createCategoriesTable();

  if (await booksNeedRebuild()) await rebuildBooksTable();
  else await createBooksTable();

  if (await borrowingsNeedRebuild()) await rebuildBorrowingsTable();
  else await createBorrowingsTable();

  await removeDuplicateCategories();

  await run('CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_user_name ON categories(user_id, name COLLATE NOCASE)');
  await run('CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id)');
  await run('CREATE INDEX IF NOT EXISTS idx_borrowings_user_id ON borrowings(user_id)');

  await run('PRAGMA foreign_keys = ON');
}

module.exports = { db, run, get, all, initializeDatabase };
