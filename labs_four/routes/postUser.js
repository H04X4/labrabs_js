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
    res.render('postUser', { arrayDirects });
});

router.post('/', (req, res) => {
    const { firstName, lastName, rating, gender, arrayDirects: directs } = req.body;

    const user = {
        firstName,
        lastName,
        rating,
        gender: Number(gender),
        arrayDirects: Array.isArray(directs) ? directs.map(Number) : [Number(directs)]
    };

    const filePath = path.join(__dirname, '../data/users.csv');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'firstName;lastName;rating;gender;directs\n');
    }

    const line = `${user.firstName};${user.lastName};${user.rating};${user.gender};${user.arrayDirects.join(',')}\n`;
    fs.appendFileSync(filePath, line);

    res.redirect('/getUsers');
});

module.exports = router;
