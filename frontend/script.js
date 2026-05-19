const API = '';
let books = [];
let categories = [];
let editingBookId = null;
let token = '';
let currentUser = null;
localStorage.removeItem('booknestToken');
localStorage.removeItem('booknestUser');

const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const dashboard = document.getElementById('dashboard');
const booksTable = document.getElementById('booksTable');
const bookForm = document.getElementById('bookForm');
const categoryForm = document.getElementById('categoryForm');
const borrowingForm = document.getElementById('borrowingForm');
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(API + url, {
    headers: authHeaders(),
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) logout();
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function saveAuth(data) {
  token = data.token;
  currentUser = data.user;
  showApp();
}

function logout() {
  token = '';
  currentUser = null;
  localStorage.removeItem('booknestToken');
  localStorage.removeItem('booknestUser');
  clearAppState();
  showAuth();
}

function showAuth() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  userInfo.textContent = '';
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
  loginCard.classList.remove('hidden');
  registerCard.classList.add('hidden');
}

function switchAuthView(view) {
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
  if (view === 'register') {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
  } else {
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
  }
}

function clearAppState() {
  books = [];
  categories = [];
  editingBookId = null;
  bookForm.reset();
  categoryForm.reset();
  borrowingForm.reset();
  document.getElementById('currentPage').value = 0;
  document.getElementById('search').value = '';
  document.getElementById('filterCategory').innerHTML = '<option value="">All Categories</option>';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterPriority').value = '';
  document.getElementById('categoryId').innerHTML = '<option value="">No Category</option>';
  document.getElementById('borrowBookId').innerHTML = '<option value="">Choose book</option>';
  document.getElementById('categoriesList').innerHTML = '';
  document.getElementById('borrowingsList').innerHTML = '';
  booksTable.innerHTML = '';
  dashboard.innerHTML = '';
}

async function showApp() {
  clearAppState();
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  userInfo.textContent = currentUser ? `Logged in as ${currentUser.name}` : '';
  await loadAll();
}

function calculateClientProgress(currentPage, totalPages) {
  if (!totalPages || totalPages <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((currentPage / totalPages) * 100)));
}

function validateBookForm() {
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const totalPages = Number(document.getElementById('totalPages').value);
  const currentPage = Number(document.getElementById('currentPage').value);
  const rating = document.getElementById('rating').value;
  if (title.length < 2) return 'Title must be at least 2 characters';
  if (author.length < 2) return 'Author must be at least 2 characters';
  if (totalPages <= 0) return 'Total pages must be greater than 0';
  if (currentPage < 0) return 'Current page cannot be negative';
  if (currentPage > totalPages) return 'Current page cannot be greater than total pages';
  if (rating && (Number(rating) < 1 || Number(rating) > 5)) return 'Rating must be between 1 and 5';
  return null;
}

async function loadAll() {
  await loadCategories();
  await Promise.all([loadBooks(), loadDashboard(), loadBorrowings()]);
}

async function loadDashboard() {
  const stats = await apiRequest('/api/dashboard');
  dashboard.innerHTML = `
    <div class="card"><span>Total Books</span><strong>${stats.totalBooks}</strong></div>
    <div class="card"><span>Reading</span><strong>${stats.reading}</strong></div>
    <div class="card"><span>Completed</span><strong>${stats.completed}</strong></div>
    <div class="card"><span>Borrowed</span><strong>${stats.borrowed}</strong></div>
    <div class="card"><span>Average Rating</span><strong>${stats.averageRating}</strong></div>
    <div class="card"><span>Pages Read</span><strong>${stats.totalPagesRead}</strong></div>
  `;
}

async function loadCategories() {
  categories = await apiRequest('/api/categories');
  const categorySelect = document.getElementById('categoryId');
  const filterCategory = document.getElementById('filterCategory');
  categorySelect.innerHTML = '<option value="">No Category</option>';
  filterCategory.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(category => {
    categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    filterCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  });
  renderCategories();
}

function renderCategories() {
  const list = document.getElementById('categoriesList');
  list.innerHTML = categories.map(category => `
    <div class="small-item">
      <span>${category.name}</span>
      <button class="danger" onclick="deleteCategory(${category.id})">Delete</button>
    </div>
  `).join('');
}

async function loadBooks() {
  const params = new URLSearchParams();
  const search = document.getElementById('search').value.trim();
  const categoryId = document.getElementById('filterCategory').value;
  const status = document.getElementById('filterStatus').value;
  const priority = document.getElementById('filterPriority').value;
  if (search) params.append('search', search);
  if (categoryId) params.append('categoryId', categoryId);
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  books = await apiRequest('/api/books?' + params.toString());
  renderBooks();
  renderBorrowBookOptions();
}

function renderBooks() {
  if (!books.length) {
    booksTable.innerHTML = '<tr><td colspan="8">No books found</td></tr>';
    return;
  }
  booksTable.innerHTML = books.map(book => `
    <tr>
      <td><strong>${book.title}</strong><br><small>${book.isbn || ''}</small></td>
      <td>${book.author}</td>
      <td>${book.category_name || 'No Category'}</td>
      <td><span class="badge">${book.status}</span></td>
      <td>${book.priority}</td>
      <td class="progress">${book.progress}%<div class="progress-bar"><div class="progress-fill" style="width:${book.progress}%"></div></div></td>
      <td>${book.rating || '-'}</td>
      <td class="actions">
        <button class="edit" onclick="editBook(${book.id})">Edit</button>
        <button class="danger" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderBorrowBookOptions() {
  const select = document.getElementById('borrowBookId');
  select.innerHTML = '<option value="">Choose book</option>';
  books.forEach(book => select.innerHTML += `<option value="${book.id}">${book.title}</option>`);
}

async function loadBorrowings() {
  const records = await apiRequest('/api/borrowings');
  const list = document.getElementById('borrowingsList');
  if (!records.length) {
    list.innerHTML = '<div class="small-item">No borrowing records</div>';
    return;
  }
  list.innerHTML = records.map(record => `
    <div class="small-item">
      <span><strong>${record.book_title}</strong><br>${record.borrower_name} - ${record.status}</span>
      <button class="danger" onclick="deleteBorrowing(${record.id})">Delete</button>
    </div>
  `).join('');
}

document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      })
    });
    saveAuth(data);
  } catch (error) { alert(error.message); }
});

document.getElementById('registerForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
      })
    });
    const registeredEmail = document.getElementById('registerEmail').value;
    switchAuthView('login');
    document.getElementById('loginEmail').value = registeredEmail;
    document.getElementById('loginPassword').value = '';
    alert('Account registered successfully. You can login now.');
  } catch (error) { alert(error.message); }
});

showRegisterBtn.addEventListener('click', () => switchAuthView('register'));
showLoginBtn.addEventListener('click', () => switchAuthView('login'));
logoutBtn.addEventListener('click', logout);

bookForm.addEventListener('submit', async event => {
  event.preventDefault();
  const error = validateBookForm();
  if (error) return alert(error);

  const book = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    categoryId: document.getElementById('categoryId').value,
    isbn: document.getElementById('isbn').value,
    totalPages: Number(document.getElementById('totalPages').value),
    currentPage: Number(document.getElementById('currentPage').value),
    status: document.getElementById('status').value,
    priority: document.getElementById('priority').value,
    rating: document.getElementById('rating').value,
    notes: document.getElementById('notes').value,
    startDate: document.getElementById('startDate').value,
    finishDate: document.getElementById('finishDate').value
  };

  book.progress = calculateClientProgress(book.currentPage, book.totalPages);

  try {
    if (editingBookId) {
      await apiRequest('/api/books/' + editingBookId, { method: 'PUT', body: JSON.stringify(book) });
    } else {
      await apiRequest('/api/books', { method: 'POST', body: JSON.stringify(book) });
    }
    resetBookForm();
    await loadAll();
  } catch (error) { alert(error.message); }
});

function editBook(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;
  editingBookId = id;
  document.getElementById('formTitle').textContent = 'Edit Book';
  document.getElementById('bookId').value = book.id;
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('categoryId').value = book.category_id || '';
  document.getElementById('isbn').value = book.isbn || '';
  document.getElementById('totalPages').value = book.total_pages;
  document.getElementById('currentPage').value = book.current_page;
  document.getElementById('status').value = book.status;
  document.getElementById('priority').value = book.priority;
  document.getElementById('rating').value = book.rating || '';
  document.getElementById('notes').value = book.notes || '';
  document.getElementById('startDate').value = book.start_date || '';
  document.getElementById('finishDate').value = book.finish_date || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetBookForm() {
  editingBookId = null;
  document.getElementById('formTitle').textContent = 'Add Book';
  bookForm.reset();
  document.getElementById('currentPage').value = 0;
}

document.getElementById('cancelEdit').addEventListener('click', resetBookForm);

async function deleteBook(id) {
  if (!confirm('Delete this book?')) return;
  await apiRequest('/api/books/' + id, { method: 'DELETE' });
  await loadAll();
}

categoryForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await apiRequest('/api/categories', { method: 'POST', body: JSON.stringify({ name: document.getElementById('categoryName').value }) });
    categoryForm.reset();
    await loadCategories();
  } catch (error) { alert(error.message); }
});

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  try {
    await apiRequest('/api/categories/' + id, { method: 'DELETE' });
    await loadAll();
  } catch (error) { alert(error.message); }
}

borrowingForm.addEventListener('submit', async event => {
  event.preventDefault();
  const record = {
    bookId: document.getElementById('borrowBookId').value,
    borrowerName: document.getElementById('borrowerName').value,
    borrowDate: document.getElementById('borrowDate').value,
    returnDate: document.getElementById('returnDate').value,
    status: document.getElementById('borrowStatus').value,
    notes: document.getElementById('borrowNotes').value
  };
  try {
    await apiRequest('/api/borrowings', { method: 'POST', body: JSON.stringify(record) });
    borrowingForm.reset();
    await loadAll();
  } catch (error) { alert(error.message); }
});

async function deleteBorrowing(id) {
  if (!confirm('Delete this borrowing record?')) return;
  await apiRequest('/api/borrowings/' + id, { method: 'DELETE' });
  await loadAll();
}

['search', 'filterCategory', 'filterStatus', 'filterPriority'].forEach(id => {
  document.getElementById(id).addEventListener('input', loadBooks);
});

showAuth();
