const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authRequired } = require('../middleware/authmiddleware');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const router = express.Router();

//Registrazione utente
//funzione asincrona per chiamate a MongoDB (await)
//req = richiesta inviata dal client, res = risposta del server
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, address } = req.body;

    // controllo campi obbligatori
    if (!name || !surname || !email || !password || !address) {
      return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
    }

    // controllo se email già registrata
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creazione nuovo utente
    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      address,
      role: 'customer'
    });

    await newUser.save();

    // token JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'Errore nella registrazione',
      error: err.message
    });
  }
});


//Login utente
router.post('/login', async (req, res) => {
    try {
        console.log("BODY RICEVUTO:", req.body);

        const { email, password } = req.body;

        //controllo dati utente
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email o password errati' });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(400).json({ message: 'Email o password errati' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Errore nel login', error: err.message });
    }   
});

//GET per restituire i dati dell'utente loggato
router.get('/me', authRequired, async(req, res) => {
    try {
        //authRequired mette UserId dentro req.user
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json({
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            address: user.address,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: 'Errore recupero utente' });
    }
});

module.exports = router;