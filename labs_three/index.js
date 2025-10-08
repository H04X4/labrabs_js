const express = require('express');
const path = require('path');
const fs = require('fs');

const config = require('./config.json');
const app = express();
const jsonDir = path.join(__dirname, config.dirJSON);
const jsonPath = path.join(jsonDir, config.fileName);

if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'css')));

const abitursRouter = require('./routes/abiturs')(jsonPath);
const abitursPostRouter = require('./routes/abiturs_post')(jsonPath);

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', abitursRouter);
app.use('/', abitursPostRouter);

const { HOST, PORT } = config.hosting;
const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
server.on('error', err => console.error('Server error:', err.message));