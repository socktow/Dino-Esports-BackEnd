const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  updateEmail, 
  updatePassword 
} = require('../controllers/userController');

const {
    upload
} = require('../controllers/uploadController');

const {
    createTournament,
    getTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    addTeamToTournament,
    getTournamentsByUser
} = require('../controllers/tournamentController');

const {
    getDisplayByHost,
    createDisplay,
    resetDisplay,
    updateTeamConfig,
    updatePlayerConfig
} = require('../controllers/displayController');

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user email (protected route)
router.put('/email', protect, updateEmail);

// Update user password (protected route)
router.put('/password', protect, updatePassword);

// Upload routes
// router.post('/upload', protect, upload.single('image'), uploadImage);
// router.delete('/upload/:publicId(*)', protect, deleteImage);

// Tournament routes
router.post('/tournaments', protect, upload.single('logo'), createTournament);
router.get('/tournaments', getTournaments);
router.get('/tournaments/host/:username', protect, getTournamentsByUser);
router.get('/tournaments/:tournamentId', getTournamentById);
router.put('/tournaments/:tournamentId', protect, upload.single('logo'), updateTournament);
router.delete('/tournaments/:tournamentId', protect, deleteTournament);
router.post('/tournaments/:tournamentId/addteam', protect, upload.single('logo'), addTeamToTournament);

// Display routes
router.get('/display/:host', protect, getDisplayByHost);
router.post('/display/:host', protect, createDisplay);
router.put('/display/reset/:host', protect, resetDisplay);
router.put('/display/team/:host', protect, updateTeamConfig);
router.put('/display/player/:host', protect, updatePlayerConfig);

module.exports = router; 