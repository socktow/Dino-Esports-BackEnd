const mongoose = require('mongoose');

const displaySchema = new mongoose.Schema({
    host: {
        type: String,
        required: true,
        trim: true
    },
    teamConfig: {
        redTeamName: {
            type: String,
            default: ""
        },
        blueTeamName: {
            type: String,
            default: ""
        },
        redTeamScore: {
            type: String,
            default: ""
        },
        blueTeamScore: {
            type: String,
            default: ""
        },
        logoRedTeam: {
            type: String,
            default: ""
        },
        logoBlueTeam: {
            type: String,
            default: ""
        },
        formatMatch: {
            type: String,
            enum: ["bo1", "bo2", "bo3", "bo5"],
            default: "bo1"
        }
    },
    playerConfig: {
        customNamePlayer0: { type: String, default: "" },
        customNamePlayer1: { type: String, default: "" },
        customNamePlayer2: { type: String, default: "" },
        customNamePlayer3: { type: String, default: "" },
        customNamePlayer4: { type: String, default: "" },
        customNamePlayer5: { type: String, default: "" },
        customNamePlayer6: { type: String, default: "" },
        customNamePlayer7: { type: String, default: "" },
        customNamePlayer8: { type: String, default: "" },
        customNamePlayer9: { type: String, default: "" }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Display', displaySchema);
