const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '../users.db'));

// Форма для добавления или редактирования пользователя
router.get('/postUser', (req, res) => {
    const id = req.query.id; 
    db.all("SELECT idGroup, nameGroup FROM groups", [], (err, groups) => {
        if (err) return res.status(500).send("Ошибка базы данных");
        if (id) {
            db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
                if (err) return res.status(500).send("Ошибка базы данных");
                res.render('postUser', { groups, user, isEdit: true });
            });
        } else {
            res.render('postUser', { groups, user: {}, isEdit: false });
        }
    });
});

// POST — добавление нового или обновление существующего пользователя
router.post('/postUser', (req, res) => {
    const { id, firstName, lastName, rating, gender, idGroup } = req.body;
    if (id) {
        const stmt = db.prepare("UPDATE users SET firstName=?, lastName=?, rating=?, gender=?, idGroup=? WHERE id=?");
        stmt.run(firstName, lastName, rating, gender, idGroup, id, function(err) {
            if (err) return res.status(500).send("Ошибка обновления");
            res.redirect('/getUsers');
        });
        stmt.finalize();
    } else {
        const stmt = db.prepare("INSERT INTO users (firstName, lastName, rating, gender, idGroup) VALUES (?, ?, ?, ?, ?)");
        stmt.run(firstName, lastName, rating, gender, idGroup, function(err) {
            if (err) return res.status(500).send("Ошибка вставки");
            res.redirect('/getUsers');
        });
        stmt.finalize();
    }
});

module.exports = router;