const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('database.db');

const directsData = JSON.parse(fs.readFileSync('directs.json', 'utf-8'));
const abitursData = JSON.parse(fs.readFileSync('abiturs.json', 'utf-8'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS directs (
        idDirect INTEGER PRIMARY KEY,
        nameDirect TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS abiturs (
        idAbitur INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        rating TEXT,
        gender INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS abiturToDirect (
        idAbitur INTEGER,
        idDirect INTEGER,
        PRIMARY KEY(idAbitur, idDirect),
        FOREIGN KEY(idAbitur) REFERENCES abiturs(idAbitur),
        FOREIGN KEY(idDirect) REFERENCES directs(idDirect)
    )`);

    db.run(`DELETE FROM directs`);
    db.run(`DELETE FROM abiturs`);
    db.run(`DELETE FROM abiturToDirect`);

    const stmtDirects = db.prepare("INSERT INTO directs (idDirect, nameDirect) VALUES (?, ?)");
    directsData.forEach(d => stmtDirects.run(d.idDirect, d.nameDirect));
    stmtDirects.finalize();

    const stmtAbiturs = db.prepare("INSERT INTO abiturs (firstName, lastName, rating, gender) VALUES (?, ?, ?, ?)");
    abitursData.forEach(a => stmtAbiturs.run(a.firstName, a.lastName, a.rating, a.gender));
    stmtAbiturs.finalize();

    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (1,0)");
    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (1,1)");
    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (2,1)");
    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (2,2)");
    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (3,0)");
    db.run("INSERT INTO abiturToDirect (idAbitur, idDirect) VALUES (3,2)");

    console.log("База данных и таблицы созданы, данные добавлены.");
});

db.close();