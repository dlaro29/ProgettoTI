const mongoose = require('mongoose');

//definizione dei campi principali per un ordine
const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        record: { type: mongoose.Schema.Types.ObjectId, ref: 'Record', required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['in elaborazione', 'pagato', 'spedito', 'consegnato', 'cancellato'], default: 'in attesa' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);