"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(__dirname, 'ws_chat.db');
const db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error: ', err.message);
    }
    else {
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
exports.default = db;
