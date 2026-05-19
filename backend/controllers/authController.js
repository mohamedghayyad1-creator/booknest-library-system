const authService = require('../services/authService');

function handleError(res, error) {
  res.status(error.status || 500).json({ error: error.message || 'Server error' });
}

async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) { handleError(res, error); }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) { handleError(res, error); }
}

module.exports = { register, login };
