const dashboardService = require('../services/dashboardService');

async function getDashboard(req, res) {
  try {
    res.json(await dashboardService.getDashboard());
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}

module.exports = { getDashboard };
