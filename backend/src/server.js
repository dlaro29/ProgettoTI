//import delle librerie necessarie
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

//import delle rotte dei vinili
const recordRoutes = require('./routes/records');

//creazione dell'app express
const app = express();

//middleware: funzioni che processano le richieste in arrivo
app.use(cors()); //abilita cors
app.use(express.json()); //permette di leggere JSON

//connessione al database
connectDB();

//rotta heath check test
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

//rotta per i vinili
app.use('/api/records', recordRoutes);

//porta di ascolto default 3000
const PORT = process.env.PORT || 3001;

//avvio del server
app.listen(PORT, () => {
    console.log("Server beckend in ascolto sulla porta " + PORT);
});
