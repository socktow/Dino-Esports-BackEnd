const mongoose = require('mongoose');
const Counter = require('./counter'); 

const tournamentSchema = new mongoose.Schema({
    tournamentId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    host: {
        type: String,
        required: true,
        trim: true
    },
    logo: {  
        type: String,
        required: false,
    },
    teams: [{
        teamName: {
            type: String,
            required: true,
            trim: true
        },
        teamTag: {
            type: String,
            required: true,
            trim: true
        },
        logo: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Pre-save hook để auto tăng tournamentId
tournamentSchema.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: 'tournamentId' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.tournamentId = counter.value;
    }
    next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);
