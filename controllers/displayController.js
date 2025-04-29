const Display = require('../models/Display');

// Get display settings by host
exports.getDisplayByHost = async (req, res) => {
    try {
        const { host } = req.params;
        const display = await Display.findOne({ host });
        
        if (!display) {
            return res.status(404).json({ message: 'Display settings not found for this host' });
        }
        
        res.json(display);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or update display settings
exports.createDisplay = async (req, res) => {
    try {
        const { host } = req.params;
        const { teamConfig, playerConfig } = req.body;
        
        // Check if display already exists for this host
        let display = await Display.findOne({ host });
        
        if (display) {
            // Update existing display
            display.teamConfig = { ...display.teamConfig, ...teamConfig };
            display.playerConfig = { ...display.playerConfig, ...playerConfig };
            await display.save();
        } else {
            // Create new display
            display = new Display({
                host,
                teamConfig,
                playerConfig
            });
            await display.save();
        }
        
        res.status(201).json(display);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update team configuration
exports.updateTeamConfig = async (req, res) => {
    try {
        const { host } = req.params;
        const teamConfig = req.body;
        
        const display = await Display.findOne({ host });
        if (!display) {
            return res.status(404).json({ message: 'Display settings not found for this host' });
        }
        
        display.teamConfig = { ...display.teamConfig, ...teamConfig };
        await display.save();
        
        res.json(display);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update player configuration
exports.updatePlayerConfig = async (req, res) => {
    try {
        const { host } = req.params;
        const playerConfig = req.body;
        
        const display = await Display.findOne({ host });
        if (!display) {
            return res.status(404).json({ message: 'Display settings not found for this host' });
        }
        
        display.playerConfig = { ...display.playerConfig, ...playerConfig };
        await display.save();
        
        res.json(display);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Reset display settings to default
exports.resetDisplay = async (req, res) => {
    try {
        const { host } = req.params;
        
        const display = await Display.findOne({ host });
        if (!display) {
            return res.status(404).json({ message: 'Display settings not found for this host' });
        }
        
        // Reset to default values
        display.teamConfig = {
            redTeamName: "",
            blueTeamName: "",
            redTeamScore: "",
            blueTeamScore: "",
            logoRedTeam: "",
            logoBlueTeam: "",
            formatMatch: "bo1"
        };
        
        display.playerConfig = {
            customNamePlayer0: "",
            customNamePlayer1: "",
            customNamePlayer2: "",
            customNamePlayer3: "",
            customNamePlayer4: "",
            customNamePlayer5: "",
            customNamePlayer6: "",
            customNamePlayer7: "",
            customNamePlayer8: "",
            customNamePlayer9: ""
        };
        
        await display.save();
        res.json(display);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
