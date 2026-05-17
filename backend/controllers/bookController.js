const bookService = require('../services/bookService');

function handleError(res, error) {
  res.status(error.status || 500).json({ error: error.message || 'Server error' });
}

async function getBooks(req, res) {
  try {
    const books = await bookService.getBooks(req.query);
    res.json(books);
  } catch (error) { handleError(res, error); }
}

async function getBook(req, res) {
  try {
    const book = await bookService.getBook(req.params.id);
    res.json(book);
  } catch (error) { handleError(res, error); }
}

async function createBook(req, res) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) { handleError(res, error); }
}

async function updateBook(req, res) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (error) { handleError(res, error); }
}

async function deleteBook(req, res) {
  try {
    const result = await bookService.deleteBook(req.params.id);
    res.json(result);
  } catch (error) { handleError(res, error); }
}

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
