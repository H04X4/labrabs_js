const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const csv = require('csvtojson');

dotenv.config();
const app = express();
app.use(bodyParser.json());

const dirJSON = process.env.dirJSON;
const fileName = process.env.fileName;
const jsonPath = path.join(__dirname, dirJSON, fileName);
const csvPath = path.join(__dirname, 'csv', 'exam_balls.csv');

if (!fs.existsSync(path.join(__dirname, dirJSON))) fs.mkdirSync(path.join(__dirname, dirJSON));

// ---- ЗАДАЧА 1: CSV → JSON ----
app.get('/convert', async (req, res) => {
  if (!fs.existsSync(csvPath)) return res.status(404).send('CSV файл не найден');
  const jsonArray = await csv({ delimiter: ';' }).fromFile(csvPath);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonArray, null, 2), 'utf8');
  res.send('CSV успешно конвертирован в JSON и сохранён');
});

// ---- Вспомогательная функция ----
function readJSON() {
  if (!fs.existsSync(jsonPath)) return [];
  const data = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(data);
}

function saveJSON(data) {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
}

// ---- ЗАДАЧА 2: API методы ----

// GET — получить все объекты
app.get('/data', (req, res) => {
  const data = readJSON();
  res.json(data);
});

// POST — добавить объект (автоматический индекс)
app.post('/data', (req, res) => {
  const data = readJSON();
  const newItem = req.body;
  newItem.IdStudent = (data.length > 0 ? (Math.max(...data.map(o => +o.IdStudent || 0)) + 1) : 1).toString();
  data.push(newItem);
  saveJSON(data);
  res.json({ message: 'Объект добавлен', item: newItem });
});

// PUT — перезаписать объект полностью
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  let data = readJSON();
  const index = data.findIndex(item => item.IdStudent === id);
  if (index === -1) return res.status(404).send('Объект не найден');
  data[index] = { ...req.body, IdStudent: id };
  saveJSON(data);
  res.json({ message: 'Объект перезаписан', item: data[index] });
});

// PATCH — изменить часть полей объекта
app.patch('/data/:id', (req, res) => {
  const id = req.params.id;
  let data = readJSON();
  const index = data.findIndex(item => item.IdStudent === id);
  if (index === -1) return res.status(404).send('Объект не найден');
  data[index] = { ...data[index], ...req.body };
  saveJSON(data);
  res.json({ message: 'Объект обновлён', item: data[index] });
});

// DELETE — удалить объект
app.delete('/data/:id', (req, res) => {
  const id = req.params.id;
  let data = readJSON();
  const index = data.findIndex(item => item.IdStudent === id);
  if (index === -1) return res.status(404).send('Объект не найден');
  const deleted = data.splice(index, 1);
  saveJSON(data);
  res.json({ message: 'Объект удалён', item: deleted[0] });
});

// ---- Запуск ----
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}`);
});