const express = require('express');
const { findUserByLogin } = require('../models/userModel');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../users.db'));

const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.cookies.userId;
    if (!userId) return res.redirect('/');
    db.get("SELECT * FROM users WHERE idUser = ?", [userId], (err, user) => {
        if (err || !user) return res.redirect('/');
        res.render('cabinet', { user });
    });
});

module.exports = router;