const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const getUsersRouter = require('./routes/getUsers');
const postUserRouter = require('./routes/postUser');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/getUsers', getUsersRouter);
app.use('/postUser', postUserRouter);

// редирект с корня на /getUsers
app.get('/', (req, res) => res.redirect('/getUsers'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));