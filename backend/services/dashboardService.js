const bookModel = require('../models/bookModel');
const borrowingModel = require('../models/borrowingModel');
const { calculateDashboardStats } = require('../utils/bookLogic');

async function getDashboard(userId) {
  const books = await bookModel.findAll(userId, {});
  const borrowings = await borrowingModel.findAll(userId);
  return calculateDashboardStats(books, borrowings);
}

module.exports = { getDashboard };
