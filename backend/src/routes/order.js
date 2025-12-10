const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Record = require('../models/Record');
const {authRequired, adminRequired} = require('../middleware/authmiddleware');

const router = express.Router();

//POST (creazione ordine)
router.post('/', authRequired, async (req, res) => {
    try {
        //controllo se l'utente esiste e recupero il carrello
        const user = await User.findById(req.user.id).populate('cart.record');
        if (!user) { return res.status(404).json({message: 'Utente non trovato'}); }
        //controllo se il carrello è vuoto
        if (user.cart.length === 0) { return res.status(400).json({message: 'Il carrello è vuoto'}); }
        //creo l'ordine dagli articoli nel carrello
        const items = user.cart.map(item => ({
            record: item.record._id,
            title: item.record.title,
            price: item.record.price,
            quantity: item.quantity
        }));
        //calcolo il totale
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        //creo e salvo l'ordine
        const order = new Order({
            user: user._id,
            items,
            total,
            status: 'in elaborazione',
        });

        await order.save();
        //svuota il carrello dell'utente dopo aver creato l'ordine
        user.cart = [];
        await user.save();
        return res.status(201).json({message: 'Ordine creato con successo', order});
    } catch (err) {
        res.status(500).json({message: 'Errore nella creazione del server ordine'});
    }
});

//GET (ordini utente loggato)
router.get('/myorders', authRequired, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user.id}).sort({createdAt: -1}).populate('items.record');
        return res.json(orders);
    } catch (err) {
        console.error('Errore nel recupero degli ordini utente:', err);
        return res.status(500).json({message: 'Errore nel recupero degli ordini utente'});
    }
});

//GET (tutti gli ordini) - solo admin
router.get('/', authRequired, adminRequired, async (req, res) => {
    //recupero tutti gli ordini
    try {
        const orders = await Order.find().populate('user', 'email').sort({createdAt: -1});
        res.json(orders);
    } catch (err) {
        res.status(500).json({message: 'Errore nel recupero degli ordini'});
    }
});

module.exports = router;