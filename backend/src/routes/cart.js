const express = require('express');
const User = require('../models/User');
const Record = require('../models/Record');
const { authRequired } = require('../middleware/authmiddleware');

const router = express.Router();

//gestione API per il carrello
//GET (lettura del carrello)
router.get('/', authRequired, async (req, res) => {
    try {
        //certa l'utente che fa fatto richiesta
        const user = await User.findById(req.user.id).populate({
          path: "cart.record",
          select: "title artist price imageUrl"
        }); //populate per ottenere i dettagli dei record nel carrello
        //controllo se l'utente esiste
        if (!user) { return res.status(404).json({ message: 'Utente non trovato' }); }
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del carrello' } );
    }
});

//POST (aggiunta al carrello)
router.post('/add', authRequired, async (req, res) => {
  try {
    const { recordId, quantity } = req.body;

    // controllo parametri
    if (!recordId) {
      return res.status(400).json({ message: 'recordId mancante' });
    }

    // normalizzo quantity: deve essere un numero >=1, altrimenti 1
    const qty = Number(quantity) && Number(quantity) > 0 ? Number(quantity) : 1;

    // cerco l'utente
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // controllo se il vinile esiste
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Vinile non trovato' });
    }

    // cerco se il record esiste già nel carrello
    const existingItem = user.cart.find(
      (item) => item.record.toString() === recordId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ record: recordId, quantity: qty });
    }

    await user.save();

    // ricarico l'utente con populate per restituire i dettagli completi
    const updatedUser = await User.findById(req.user.id).populate('cart.record');

    return res.status(200).json(updatedUser.cart);
  } catch (error) {
    console.error('Errore in POST /api/cart/add:', error);
    return res.status(500).json({
      message: "Errore nell'aggiunta al carrello",
      error: error.message
    });
  }
});

//PUT (aggiornamento quantità nel carrello)
router.put('/update', authRequired, async (req, res) => {
    try {
        const { recordId, quantity } = req.body;
        const user = await User.findById(req.user.user.id);
        if (!user) { return res.status(404).json({ message: 'Utente non trovato' }); }

        //cerco l'articolo nel carrello da aggiornare
        const item = user.cart.find( i => i.record.toString() === recordId);
        if (!item) { return res.status(404).json({ message: 'Articolo non trovato nel carrello' }); }
        //aggiorno la quantità
        item.quantity = quantity;
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiornamento del carrello' });
    }
});

//DELETE (rimozione dal carrello)
router.delete('/remove/:recordId', authRequired, async (req, res) => {
//sempre recupero utente prima di modificare carrello
  try {
    const { recordId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    //filtro il carrello per rimuovere l'articolo specificato (recordId)
    user.cart = user.cart.filter(
      i => i.record.toString() !== recordId
    );
    await user.save();
    //restituisco il carrello aggiornato
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella rimozione dal carrello' });
  }
});

module.exports = router;
