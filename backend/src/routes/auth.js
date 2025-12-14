const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const router = express.Router();

//Registrazione utente
//funzione asincrona per chiamate a MongoDB (await)
//req = richiesta inviata dal client, res = risposta del server
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        //controllo se l'utente esiste già
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        //lettura dati dal corpo della richiesta
        //creazione nuovo utente
        const newUser = new User({ email, password, username });
        await newUser.save();

        //creazione token JWT (Json Web Token) per l'autenticazione 
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, //id utente per riconoscimento
            JWT_SECRET, //chiave segreta per firmare il token
            { expiresIn: '7d' } //scadenza del token
        );
        //risposta con token e dati utente
        res.status(201).json({
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role}
        });
    } catch (err) {
        res.status(500).json({ message: 'Errore nella registrazione', error: err.message });
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
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Errore nel login', error: err.message });
    }   
});

module.exports = router;