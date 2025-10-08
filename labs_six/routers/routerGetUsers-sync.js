const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '../users.db'));

router.get('/getUsers', (req, res) => {
    const sql = `SELECT u.id, u.firstName, u.lastName, u.rating, u.gender, g.nameGroup
                 FROM users u LEFT JOIN groups g ON u.idGroup = g.idGroup`;
    db.all(sql, [], (err, users) => {
        if (err) return res.status(500).send("Ошибка базы данных");
        res.render('getUsers', { users });
    });
});

module.exports = router;