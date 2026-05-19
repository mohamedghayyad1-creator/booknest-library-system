const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const categoryModel = require('../models/categoryModel');

const JWT_SECRET = process.env.JWT_SECRET || 'booknest_default_secret_key';
const defaultCategories = ['Programming', 'University', 'Self Development', 'Business', 'Novel', 'History'];

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
}

function validateRegisterData(data) {
  const errors = [];
  if (!data.name || String(data.name).trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!data.email || !String(data.email).includes('@')) errors.push('Valid email is required');
  if (!data.password || String(data.password).length < 6) errors.push('Password must be at least 6 characters');
  return errors;
}

async function createDefaultCategories(userId) {
  for (const name of defaultCategories) {
    try {
      await categoryModel.create(userId, { name });
    } catch (error) {
      if (!String(error.message || '').includes('UNIQUE constraint failed')) {
        throw error;
      }
    }
  }
}

async function register(data) {
  const userData = {
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim().toLowerCase(),
    password: String(data.password || '')
  };

  const errors = validateRegisterData(userData);
  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }

  const existing = await userModel.findByEmail(userData.email);
  if (existing) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await userModel.create({ ...userData, password: hashedPassword });

  await createDefaultCategories(user.id);

  return { user, token: createToken(user), message: 'Account created successfully' };
}

async function login(data) {
  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const safeUser = { id: user.id, name: user.name, email: user.email };
  await createDefaultCategories(safeUser.id);
  return { user: safeUser, token: createToken(safeUser) };
}

module.exports = { register, login, JWT_SECRET };
