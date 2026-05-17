const borrowingService = require('../services/borrowingService');

function handleError(res, error) {
  res.status(error.status || 500).json({ error: error.message || 'Server error' });
}

async function getBorrowings(req, res) {
  try { res.json(await borrowingService.getBorrowings()); } catch (error) { handleError(res, error); }
}
async function createBorrowing(req, res) {
  try { res.status(201).json(await borrowingService.createBorrowing(req.body)); } catch (error) { handleError(res, error); }
}
async function updateBorrowing(req, res) {
  try { res.json(await borrowingService.updateBorrowing(req.params.id, req.body)); } catch (error) { handleError(res, error); }
}
async function deleteBorrowing(req, res) {
  try { res.json(await borrowingService.deleteBorrowing(req.params.id)); } catch (error) { handleError(res, error); }
}

module.exports = { getBorrowings, createBorrowing, updateBorrowing, deleteBorrowing };
