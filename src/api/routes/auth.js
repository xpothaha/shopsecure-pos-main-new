// Express router for authentication routes
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Load environment variables
dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(token, remoteip) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password, turnstileToken } = req.body;
    
    // Verify Turnstile token
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Turnstile token is required' });
    }
    
    const isTokenValid = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Invalid Turnstile token' });
    }
    
    // Query user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Remove password from response
    delete user.password;
    delete user.password_salt;
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, turnstileToken } = req.body;
    
    // Verify Turnstile token
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Turnstile token is required' });
    }
    
    const isTokenValid = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Invalid Turnstile token' });
    }
    
    // Check if username already exists
    const usernameCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (id, username, password, password_salt, name, email, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [uuidv4(), username, hashedPassword, salt, name, email, 'user']
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Remove password from response
    delete user.password;
    delete user.password_salt;
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token route
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.id]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Remove password from response
    delete user.password;
    delete user.password_salt;
    
    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, turnstileToken } = req.body;
    
    // Verify Turnstile token
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Turnstile token is required' });
    }
    
    const isTokenValid = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Invalid Turnstile token' });
    }
    
    // Check if email exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Don't reveal that email doesn't exist for security reasons
      return res.json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // In a real app, you would generate a reset token and send an email
    // For this demo, we'll just return a success message
    
    res.json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, turnstileToken } = req.body;
    
    // Verify Turnstile token
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Turnstile token is required' });
    }
    
    const isTokenValid = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Invalid Turnstile token' });
    }
    
    // In a real app, you would verify the reset token
    // For this demo, we'll just return a success message
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
