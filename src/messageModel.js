const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../db/chat.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

module.exports = db;