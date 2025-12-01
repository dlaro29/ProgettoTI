const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
 
//GET
//ottenere tutti i vinili
router.get('/', async (req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero dei vinili" });
    }
});

//trovare vinile specifico
router.get('/:id', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Vinile non trovato" });
        res.json(record);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero del vinile" });
    }
});

// aggiungere un nuovo vinile
router.post('/', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save(); // <--- SALVATAGGIO NEL DB
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Errore POST /api/records:", err);
        res.status(400).json({ message: "Errore nell'aggiunta del vinile" });
    }
});

//PUT
//aggiornare un vinile esistente
router.put('/:id', async (req, res) => {
    try {
        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // restituisce il documento aggiornato
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: "Vinile non trovato" });
        }

        res.json(updatedRecord);
    } catch (err) {
        console.error("Errore PUT /api/records/:id:", err);
        res.status(400).json({ message: "Errore nell'aggiornamento del vinile" });
    }
});

module.exports = router;