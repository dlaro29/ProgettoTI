const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   // importa bcrypt

// definizione dei campi principali per un utente
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  surname: { type: String, required: true, unique: false },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {type: String, required: true},
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
  cart: [
    { 
      record:   { type: mongoose.Schema.Types.ObjectId, ref: 'Record' },
      quantity: { type: Number, default: 1 } 
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
