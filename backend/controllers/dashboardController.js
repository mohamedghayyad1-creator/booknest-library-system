const dashboardService = require('../services/dashboardService');

async function getDashboard(req, res) {
  try {
    res.json(await dashboardService.getDashboard(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}

module.exports = { getDashboard };
