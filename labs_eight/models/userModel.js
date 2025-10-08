const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../users.db'));

function findUserByLogin(login, callback) {
    db.get("SELECT * FROM users WHERE userLogin = ?", [login], callback);
}

module.exports = { findUserByLogin };