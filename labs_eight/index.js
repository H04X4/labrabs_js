const express = require('express');
const cookieParser = require('cookie-parser');
const { HOST, PORT } = require('./config.json').hosting;

const app = express();

app.set('view engine', 'ejs');
app.use('/css', express.static('css'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', require('./routers/authRouter'));
app.use('/cabinet', require('./routers/cabinetRouter'));

app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}/`));