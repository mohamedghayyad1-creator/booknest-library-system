const bookModel = require('../models/bookModel');
const borrowingModel = require('../models/borrowingModel');
const { calculateDashboardStats } = require('../utils/bookLogic');

async function getDashboard() {
  const books = await bookModel.findAll({});
  const borrowings = await borrowingModel.findAll();
  return calculateDashboardStats(books, borrowings);
}

module.exports = { getDashboard };
