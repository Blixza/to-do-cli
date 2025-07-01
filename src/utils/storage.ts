import Database from 'better-sqlite3';
import path from 'path';

// Определяем путь к файлу базы данных
const dbPath = path.resolve(
  __dirname,
  '../../todo.db'
);

// Создаём подключение к базе данных
const db = new Database(dbPath);

// Создаём таблицу задач, если её нет
// Это делается один раз при запуске приложения
// PRIMARY KEY AUTOINCREMENT — чтобы id увеличивался автоматически
// NOT NULL — чтобы нельзя было создать задачу без названия
// completed INTEGER — 0 (false) или 1 (true)
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
    )
`);

export default db;
