//import delle librerie necessarie
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require("path");

//import delle rotte dei vinili
const recordRoutes = require('./routes/records');
//import delle rotte per l'autenticazione
const authRoutes = require('./routes/auth');
//import delle rotte per il carrello
const cartRoutes = require('./routes/cart');
//import delle rotte per gli ordini
const orderRoutes = require('./routes/order');
const { authRequired } = require('./middleware/authmiddleware');

//creazione dell'app express
const app = express();
//express recupera i file delle copertine nella cartella uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
//middleware: funzioni che processano le richieste in arrivo
app.use(cors()); //abilita cors
app.use(express.json()); //permette di leggere JSON

//connessione al database
connectDB();

//rotta heath check test
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

//rotta per l'autenticazione
app.use('/api/auth', authRoutes);
//rotta per i vinili
app.use('/api/records', recordRoutes);
//rotta per il carrello
app.use('/api/cart', cartRoutes);
//rotta per gli ordini
app.use('/api/orders', orderRoutes);

//porta di ascolto default 3001
const PORT = process.env.PORT || 3001;

//avvio del server
app.listen(PORT, () => {
    console.log("Server backend in ascolto sulla porta " + PORT);
});
