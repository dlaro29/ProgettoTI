const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const {authRequired, adminRequired} = require('../middleware/authmiddleware');

//GET
//ottenere tutti i vinili + coninazione di filtri (Home)
router.get('/', async (req, res) => {
    try {
        //estraggo i parametri di filtro dalla query string
        const {search, genre, minPrice, maxPrice, yearFrom, yearTo } = req.query;
        const filter = {};
        //in bas ai ai parametri, costruisco il filtro (ricerca testuale)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } }
            ];
        }
        //applico altri filtri nella Navbar
        if (genre) { filter.genre = genre; }
        if (minPrice) { filter.price = { ...filter.price, $gte: Number(minPrice) }; }
        if (maxPrice) { filter.price = { ...filter.price, $lte: Number(maxPrice) }; }        //eseguo la query con i filtri
        if (yearFrom || yearTo) {
            filter.year = {};
            if (yearFrom) filter.year.$gte = Number(yearFrom);
            if (yearTo) filter.year.$lte = Number (yearTo);
        }
        const records = await Record.find(filter);
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: "Errore nella ricerca dei vinili" });
    }
});

//GET per generi (Navbar)
router.get("/meta/genres", async (req, res) => {
    try {
        const genres = await Record.distinct("genre");
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: "Errore nel recupero dei generi "});
    }
});

//GET per singolo vinile (Navbar)
router.get('/:id', async (req, res) => {
    try {
        //trovo il vinile per id
        const record = await Record.findById(req.params.id);
        if (!record) { return res.status(404).json({ message: "Vinile non trovato" }); }
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

//POST
//creazione di un nuovo vinile - solo admin
router.post('/', authRequired, adminRequired, async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ message: "Errore nella creazione del vinile" });
    }
});

//PUT
//aggiornare un vinile esistente - solo admin
router.put('/:id', authRequired, adminRequired, async (req, res) => {
    try {
        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // restituisce il documento aggiornato
        );
        //controllo se il vinile esiste
        if (!updatedRecord) { return res.status(404).json({ message: "Vinile non trovato" }); }
        res.json(updatedRecord);
    } catch (err) {
        res.status(400).json({ message: "Errore nell'aggiornamento del vinile" });
    }
});

//DELETE
//eliminare un vinile - solo admin
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
    try {
        //controllo se il vinile esiste ed elimino
        const deletedRecord = await Record.findByIdAndDelete(req.params.id);
        if (!deletedRecord) { return res.status(404).json({ message: "Vinile non trovato" }); }
        res.json({ message: "Vinile eliminato" });
    } catch (err) {
        res.status(500).json({ message: "Errore nell'eliminazione del vinile" });
    }   
});

module.exports = router;