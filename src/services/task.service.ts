import db from '../utils/storage';
import { Task } from '../models/task';

export class TaskService {
  static addTask(
    title: string,
    priority: string
  ): Task {
    const stmt = db.prepare(
      'INSERT INTO tasks (title, priority, completed) VALUES (?, ?, 0)'
    );
    const info = stmt.run(title, priority);
    return {
      id: info.lastInsertRowid as number,
      title,
      priority,
      completed: false,
    };
  }

  static getTaskById(id: number): Task | null {
    const stmt = db.prepare(
      'SELECT * FROM tasks WHERE id = ?'
    );
    const row = stmt.get(id) as Task;
    if (!row) {
      console.error(
        'Task with such ID not found'
      );
    }
    return {
      id: row.id,
      title: row.title,
      priority: row.priority,
      completed: !!row.completed,
    };
  }

  static getTaskByTitle(
    title: string
  ): Task | null {
    const stmt = db.prepare(
      'SELECT * FROM tasks WHERE title = ?'
    );
    const task = stmt.get(title) as Task;
    if (!task) {
      return null;
    }
    return {
      id: task.id,
      title: task.title,
      priority: task.priority,
      completed: !!task.completed,
    };
  }

  static editTask(
    id: number,
    newTitle: string
  ): void {
    const stmt = db.prepare(
      'UPDATE tasks SET title = ? WHERE id = ?'
    );
    if (!this.getTaskById(id)) {
      console.error(
        `Task with ID ${id} not found`
      );
      process.exit(1);
    }
    stmt.run(newTitle, id);
    const task = this.getTaskById(id);
    if (!task) {
      console.error(
        `Task with ID ${id} not found`
      );
    }
  }

  static getAllTasks(): Task[] {
    const stmt = db.prepare(
      'SELECT * FROM tasks'
    );
    return stmt.all().map((row: any) => ({
      id: row.id,
      title: row.title,
      priority: row.priority,
      completed: !!row.completed,
    }));
  }

  static getTasksByIdRange(
    min: number,
    max: number
  ): Task[] {
    const stmt = db.prepare(
      'SELECT * FROM tasks WHERE id >= ? AND id <= ?'
    );
    return stmt.all(min, max).map((row: any) => ({
      id: row.id,
      title: row.title,
      priority: row.priority,
      completed: !!row.completed,
    }));
  }

  static completeTask(id: number): void {
    const stmt = db.prepare(
      'UPDATE tasks SET completed = 1 WHERE id = ?'
    );
    stmt.run(id);
  }

  static deleteTask(id: number): void {
    const stmt = db.prepare(
      'DELETE FROM tasks WHERE id = ?'
    );
    stmt.run(id);
  }

  static deleteAllTasks(): void {
    const stmt = db.prepare('DELETE FROM tasks');
    stmt.run();
  }
}
