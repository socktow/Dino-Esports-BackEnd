const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { upload } = require('./uploadController');

// Create a new tournament
const createTournament = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Get host from authenticated user
        const host = req.user.username;
        
        // Get logo URL from Cloudinary if file was uploaded
        const logo = req.file ? req.file.path : req.body.logo;
        
        const tournament = new Tournament({
            name,
            host,
            logo,
            teams: []
        });

        await tournament.save();
        res.status(201).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating tournament' 
        });
    }
};

// Get all tournaments
const getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json({
            success: true,
            data: tournaments
        });
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tournaments' 
        });
    }
};

// Get tournament by ID
const getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.findOne({ tournamentId: req.params.tournamentId });
        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tournament' 
        });
    }
};

// Update tournament
const updateTournament = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Get logo URL from Cloudinary if file was uploaded
        const logo = req.file ? req.file.path : req.body.logo;
        
        const tournament = await Tournament.findOneAndUpdate(
            { tournamentId: req.params.tournamentId },
            { name, logo },
            { new: true }
        );
        
        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }
        res.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating tournament' 
        });
    }
};

// Delete tournament
const deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findOneAndDelete({ tournamentId: req.params.tournamentId });
        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Tournament deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting tournament' 
        });
    }
};

const addTeamToTournament = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const { teamName, teamTag } = req.body;

        // Get logo URL from Cloudinary if file was uploaded
        const logo = req.file ? req.file.path : req.body.logo;

        // Validate required fields
        if (!teamName || !teamTag || !logo) {
            return res.status(400).json({
                success: false,
                message: 'Team name, tag and logo are required'
            });
        }

        const tournament = await Tournament.findOne({ tournamentId });
        if (!tournament) {
            return res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }

        // Check if team name or tag already exists in tournament
        const existingTeam = tournament.teams.find(
            team => team.teamName === teamName || team.teamTag === teamTag
        );

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team name or tag already exists in this tournament'
            });
        }

        // Add new team
        tournament.teams.push({
            teamName,
            teamTag,
            logo
        });

        await tournament.save();

        res.status(200).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        console.error('Error adding team to tournament:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding team to tournament'
        });
    }
};

module.exports = {
    createTournament,
    getTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    addTeamToTournament
}; 