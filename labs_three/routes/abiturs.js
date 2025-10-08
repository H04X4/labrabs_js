const express = require('express');
const fs = require('fs');

module.exports = function (jsonPath) {
  const router = express.Router();

  router.get('/abiturs', (req, res) => {
    let data = [];
    if (fs.existsSync(jsonPath)) {
      try {
        data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (e) {
        data = [];
      }
    }
    res.render('abiturs', { rows: data });
  });

  return router;
};