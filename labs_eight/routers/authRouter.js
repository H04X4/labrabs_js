const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByLogin } = require('../models/userModel');

const router = express.Router();

router.get('/', (req, res) => {
    const message = req.query.error || '';
    res.render('login', { message });
});

router.post('/login', (req, res) => {
    const { login, password } = req.body;
    findUserByLogin(login, (err, user) => {
        if (err) return res.send('Ошибка базы данных');
        if (!user) return res.redirect('/?error=Такой логин не существует');
        bcrypt.compare(password, user.hashPassword, (err, result) => {
            if (result) {
                res.cookie('userId', user.idUser, { maxAge: 24*60*60*1000 });
                res.redirect('/cabinet');
            } else {
                res.redirect('/?error=Пароль введён неправильно');
            }
        });
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/');
});

module.exports = router;