const mongoose = require("mongoose")

const messageScheme = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    recipient: { type: mongoose.Types.ObjectId, ref: "user" },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageScheme);
