const express = require('express');
const fs = require('fs');
const request = require('sync-request');
const path = require('path');

const app = express();
const config = require('./config.json');
const csvPath = path.join(__dirname, 'csv', 'exam_balls.csv');
const sourceUrl = 'http://pcoding.ru/csv/exam_balls.csv';

if (!fs.existsSync(path.join(__dirname, 'csv'))) fs.mkdirSync(path.join(__dirname, 'csv'));

function parseCSV(data) {
  const lines = data.trim().split('\n').filter(l => l.trim());
  const headers = lines[0].split(';');
  const rows = lines.slice(1).map(line => {
    const values = line.split(';');
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ''));
    return obj;
  });
  return { headers, rows };
}

function saveCSV(headers, rows) {
  const content = [headers.join(';'), ...rows.map(r => headers.map(h => r[h]).join(';'))].join('\n');
  fs.writeFileSync(csvPath, content, 'utf8');
}

function showTable(rows) {
  console.table(rows.slice(0, 10));
  console.log(`Всего записей: ${rows.length}`);
}

app.get('/getData', (req, res) => {
  try {
    const resp = request('GET', sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Node.js)' },
      timeout: 5000
    });
    const body = resp.getBody('utf8');

    if (body.includes('<!DOCTYPE html>') || body.includes('<html')) {
      return res.status(500).send('Ошибка: сайт вернул HTML вместо CSV. Попробуй позже.');
    }

    fs.writeFileSync(csvPath, body, 'utf8');
    const { headers, rows } = parseCSV(body);
    showTable(rows);
    res.send(`✅ CSV успешно загружен (${rows.length} записей) и сохранён локально.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка загрузки данных: ' + err.message);
  }
});

app.get('/', (req, res) => {
  if (!fs.existsSync(csvPath)) {
    console.table([{ IdStudent: '', NameStudent: '', Sex: '', BallMath: '', BallLang: '', BallInf: '', IdDirect: '' }]);
    return res.send('Файл отсутствует, выведена пустая таблица');
  }
  const data = fs.readFileSync(csvPath, 'utf8');
  const { headers, rows } = parseCSV(data);
  showTable(rows);
  res.send('Данные из локального файла выведены в консоль');
});

app.get('/fields/:field', (req, res) => {
  const field = req.params.field;
  if (!fs.existsSync(csvPath)) return res.send('Файл отсутствует');
  const data = fs.readFileSync(csvPath, 'utf8');
  const { headers, rows } = parseCSV(data);
  if (!headers.includes(field)) return res.send('Поле не найдено');
  const sorted = rows.sort((a, b) => (a[field] < b[field] ? 1 : -1));
  showTable(sorted);
  saveCSV(headers, sorted);
  res.send(`Отсортировано по полю ${field} и выведено в консоль`);
});

app.get('/record', (req, res) => {
  const id = req.query.id;
  if (!fs.existsSync(csvPath)) return res.send('Файл отсутствует');
  const data = fs.readFileSync(csvPath, 'utf8');
  const { headers, rows } = parseCSV(data);
  const filtered = rows.filter(r => r.IdStudent !== id);
  showTable(filtered);
  saveCSV(headers, filtered);
  res.send(`Запись с IdStudent=${id} удалена`);
});

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
