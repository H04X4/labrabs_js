const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const arrayDirects = [
    "Информационные системы",
    "Прикладная информатика",
    "Программная инженерия"
];

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../data/users.csv');
    let users = [];

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.trim().split('\n');

        users = lines.slice(1).map(line => {
            const [firstName, lastName, rating, gender, directs] = line.split(';');
            return {
                firstName,
                lastName,
                rating,
                gender: Number(gender),
                arrayDirects: directs ? directs.split(',').map(Number) : []
            };
        });
    }

    res.render('getUsers', { users, arrayDirects });
});

module.exports = router;