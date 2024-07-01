const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed', 'pending'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
