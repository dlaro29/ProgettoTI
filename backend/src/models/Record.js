const mongoose = require('mongoose');

//definizione dei campi principali per un vinile
const RecordSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: {type: String, required: true },
    year: { type: Number },
    genre: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: {type: String }
});

module.exports = mongoose.model('Record', RecordSchema);