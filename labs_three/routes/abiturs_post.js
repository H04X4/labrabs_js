const express = require('express');
const fs = require('fs');

module.exports = function (jsonPath) {
  const router = express.Router();

  router.get('/abiturs_post', (req, res) => {
    res.render('abiturs_post');
  });

  router.post('/abiturs_post', (req, res) => {
    const body = req.body;
    let data = [];
    if (fs.existsSync(jsonPath)) {
      try {
        data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (e) {
        data = [];
      }
    }
    const maxId = data.reduce((m, item) => {
      const n = parseInt(item.IdStudent, 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const newId = (maxId + 1).toString();
    const newItem = {
      IdStudent: newId,
      NameStudent: body.NameStudent || '',
      Sex: body.Sex || '',
      BallMath: body.BallMath || '',
      BallLang: body.BallLang || '',
      BallInf: body.BallInf || '',
      IdDirect: body.IdDirect || ''
    };
    data.push(newItem);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    res.redirect('/');
  });

  return router;
};