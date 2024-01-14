import sqlite3 from "sqlite3";
import path from 'path';

sqlite3.verbose();

const dbPath = path.resolve(__dirname, 'ws_chat.db');

const db = new sqlite3.Database(dbPath, (err) => {
   if (err) {
       console.error('Database connection error: ', err.message);
   } else {
       db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEST UNIQUE NOT NULL
          )
    `);

       db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL,
            text TEXT NOT NULL,
            time TEXT NOT NULL,
            author INTEGER NOT NULL,
            FOREIGN KEY (author)
                REFERENCES users (id)
          )
    `);

   console.log('Connected to the SQLite database.');
   }
});

export default db;