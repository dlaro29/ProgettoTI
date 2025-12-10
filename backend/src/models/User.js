const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   // importa bcrypt

// definizione dei campi principali per un utente
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
  cart: [
    { 
      record:   { type: mongoose.Schema.Types.ObjectId, ref: 'Record' },
      quantity: { type: Number, default: 1 } 
    }
  ]
});

// hash della password prima di salvare l'utente
UserSchema.pre('save', async function () {
  // se la password non è stata modificata, non fare nulla
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // niente next(), Mongoose usa la Promise restituita dalla funzione async
});

module.exports = mongoose.model('User', UserSchema);
