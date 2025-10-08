const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '../users.db'));

router.get('/postUser', (req, res) => {
    db.all("SELECT idGroup, nameGroup FROM groups", [], (err, groups) => {
        if (err) return res.status(500).send("Ошибка базы данных");
        res.render('postUser', { groups });
    });
});

router.post('/postUser', (req, res) => {
    const { firstName, lastName, rating, gender, idGroup } = req.body;
    const stmt = db.prepare("INSERT INTO users (firstName, lastName, rating, gender, idGroup) VALUES (?, ?, ?, ?, ?)");
    stmt.run(firstName, lastName, rating, gender, idGroup, function(err) {
        if (err) return res.status(500).send("Ошибка вставки");
        res.redirect('/getUsers');
    });
    stmt.finalize();
});

module.exports = router;