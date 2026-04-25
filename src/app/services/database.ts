import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class Database {
  private dbInstance: SQLiteObject | null = null;
  private isDbInitialized = false;

  constructor(private sqlite: SQLite, private platform: Platform) {
  }

  private async init() {
    if (this.isDbInitialized) return;

    await this.platform.ready();

    console.log('Creating DB...');

    this.dbInstance = await this.sqlite.create({
      name: 'tasks.db',
      location: 'default'
    });

    console.log('DB created');

    await this.createTaskTable();

    this.isDbInitialized = true;
  }

  async createTaskTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT,
        completed INTEGER
      )
    `;
    await this.dbInstance?.executeSql(query, []);
  }

  async getTasks(): Promise<Task[]> {
    await this.init();

    const res = await this.dbInstance?.executeSql(`SELECT * FROM tasks`, []);
    const tasks: Task[] = [];

    for (let i = 0; i < (res?.rows.length || 0); i++) {
      const item = res!.rows.item(i);
      tasks.push({
        id: item.id,
        title: item.title,
        completed: item.completed === 1
      });
    }

    return tasks;
  }

  async addTask(task: Task) {
    await this.init();

    const query = `INSERT INTO tasks (id, title, completed) VALUES (?, ?, ?)`;
    await this.dbInstance?.executeSql(query, [
      task.id,
      task.title,
      task.completed ? 1 : 0
    ]);
  }

  async updateTask(task: Task) {
    await this.init();

    const query = `UPDATE tasks SET title = ?, completed = ? WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [
      task.title,
      task.completed ? 1 : 0,
      task.id
    ]);
  }
  
  async deleteTask(id: string) {
    await this.init();

    const query = `DELETE FROM tasks WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [id]);
  }
}
