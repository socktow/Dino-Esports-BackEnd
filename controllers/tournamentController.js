const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { upload } = require('./uploadController');

// Create a new tournament
const createTournament = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tournament name is required'
            });
        }

        // Require logo file to be uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tournament logo is required'
            });
        }

        const host = req.user ? req.user.username : 'system';
        const logo = req.file.path;

        const tournament = new Tournament({
            name,
            host,
            logo,
            teams: []
        });

        await tournament.save();

        console.log('Tournament created successfully:', tournament);

        res.status(201).json({
            success: true,
            data: tournament
        });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating tournament',
            error: error.message
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
        const tournament = await Tournament.findOne({ tournamentId: req.params.tournamentId }).lean();

        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }

        // Destructure and remove top-level fields
        const { _id, __v, createdAt, updatedAt, teams = [], ...rest } = tournament;

        // Remove _id from each team
        const cleanedTeams = teams.map(({ _id, ...team }) => team);

        res.status(200).json({
            success: true,
            data: {
                ...rest,
                teams: cleanedTeams
            }
        });
    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching tournament' 
        });
    }
};

const getTournamentsByUser = async (req, res) => {
    try {
        const username = req.params.username;
        
        // Truy vấn tournament theo trường host
        const tournaments = await Tournament.find({ host: username }).lean();

        if (!tournaments || tournaments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tournaments found for this user'
            });
        }

        // Làm sạch dữ liệu tournament và đội
        const cleanedTournaments = tournaments.map(t => {
            const { _id, __v, createdAt, updatedAt, teams = [], ...rest } = t;
            const cleanedTeams = teams.map(({ _id, ...team }) => team);
            return {
                ...rest,
                teams: cleanedTeams
            };
        });

        res.status(200).json({
            success: true,
            data: cleanedTournaments
        });
    } catch (error) {
        console.error('Error fetching tournaments by user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tournaments by user'
        });
    }
};

// Update tournament
const updateTournament = async (req, res) => {
    try {
        const { name } = req.body;
        const tournamentId = req.params.tournamentId;
        
        // Find the tournament first
        const tournament = await Tournament.findOne({ tournamentId });
        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }

        // Clone old data for response
        const oldData = {
            name: tournament.name,
            logo: tournament.logo
        };

        // Prepare update data
        const updateData = {
            name: name || tournament.name,
            logo: req.file ? req.file.path : tournament.logo
        };

        const updatedTournament = await Tournament.findOneAndUpdate(
            { tournamentId },
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Tournament updated successfully',
            data: {
                Old: oldData,
                New: updatedTournament
            }
        });
    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating tournament',
            error: error.message
        });
    }
};

// Add team to tournament
const addTeamToTournament = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const { teamName, teamTag } = req.body;

        const logo = req.file ? req.file.path : req.body.logo;

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

        const existingTeam = tournament.teams.find(
            team => team.teamName === teamName || team.teamTag === teamTag
        );

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team name or tag already exists in this tournament'
            });
        }

        const newTeam = {
            teamName,
            teamTag,
            logo
        };

        tournament.teams.push(newTeam);
        await tournament.save();

        res.status(200).json({
            success: true,
            message: 'Thêm Team Thành Công',
            data: newTeam
        });
    } catch (error) {
        console.error('Error adding team to tournament:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding team to tournament',
            error: error.message
        });
    }
};

// Delete tournament
const deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findOne({ tournamentId: req.params.tournamentId });
        if (!tournament) {
            return res.status(404).json({ 
                success: false,
                message: 'Tournament not found' 
            });
        }

        // Delete the tournament from database
        await Tournament.findOneAndDelete({ tournamentId: req.params.tournamentId });

        res.status(200).json({ 
            success: true,
            message: 'Tournament deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting tournament:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting tournament',
            error: error.message
        });
    }
};

module.exports = {
    createTournament,
    getTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    addTeamToTournament,
    getTournamentsByUser
}; 