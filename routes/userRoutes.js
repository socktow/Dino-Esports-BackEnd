const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  updateEmail, 
  updatePassword 
} = require('../controllers/userController');

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user email (protected route)
router.put('/email', protect, updateEmail);

// Update user password (protected route)
router.put('/password', protect, updatePassword);

module.exports = router; 