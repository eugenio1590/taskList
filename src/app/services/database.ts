import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

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
    await this.createCategoryTable();

    this.isDbInitialized = true;
  }

  async createTaskTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT,
        completed INTEGER,
        category_id TEXT
      )
    `;
    await this.dbInstance?.executeSql(query, []);
  }

  async createCategoryTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        color TEXT
      )
    `;
    await this.dbInstance?.executeSql(query, []);
  }

  private async seedCategories() {
    const res = await this.dbInstance?.executeSql(`SELECT COUNT(*) as count FROM categories`, []);
    if (res && res.rows.item(0).count === 0) {
      const defaultCategories: Category[] = [
        { id: '1', name: 'Meeting', color: '#5260ff' },
        { id: '2', name: 'Business', color: '#999999' },
        { id: '3', name: 'Freelance', color: '#2dd36f' },
        { id: '4', name: 'Family', color: '#eb445a' }
      ];
      for (const cat of defaultCategories) {
        await this.addCategory(cat);
      }
    }
  }

  async getTasks(): Promise<Task[]> {
    await this.init();

    const query = `
      SELECT
        t.id,
        t.title,
        t.completed,
        t.category_id,
        c.name as category_name,
        c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id;
    `;
    const res = await this.dbInstance?.executeSql(query, []);
    const tasks: Task[] = [];

    for (let i = 0; i < (res?.rows.length || 0); i++) {
      const item = res!.rows.item(i);
      tasks.push({
        id: item.id,
        title: item.title,
        completed: item.completed === 1,
        category: item.category_id ? {
          id: item.category_id,
          name: item.category_name,
          color: item.category_color
        } : null
      });
    }

    return tasks;
  }

  async addTask(task: Task) {
    await this.init();

    const query = `INSERT INTO tasks (id, title, completed, category_id) VALUES (?, ?, ?, ?)`;
    await this.dbInstance?.executeSql(query, [
      task.id,
      task.title,
      task.completed ? 1 : 0,
      task.category?.id || null,
    ]);
  }

  async updateTask(task: Task) {
    await this.init();

    const query = `UPDATE tasks SET title = ?, completed = ?, category_id = ? WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [
      task.title,
      task.completed ? 1 : 0,
      task.category?.id || null,
      task.id
    ]);
  }

  async deleteTask(id: string) {
    await this.init();

    const query = `DELETE FROM tasks WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [id]);
  }

  async getCategories(): Promise<Category[]> {
    await this.init();
    await this.seedCategories();

    const res = await this.dbInstance?.executeSql(`SELECT * FROM categories`, []);
    const categories: Category[] = [];

    for (let i = 0; i < (res?.rows.length || 0); i++) {
      const item = res!.rows.item(i);
      categories.push({
        id: item.id,
        name: item.name,
        color: item.color,
      });
    }

    return categories;
  }

  async addCategory(category: Category) {
    await this.init();

    const query = `INSERT INTO categories (id, name, color) VALUES (?, ?, ?)`;
    await this.dbInstance?.executeSql(query, [
      category.id,
      category.name,
      category.color,
    ]);
  }

  async updateCategory(category: Category) {
    await this.init();

    const query = `UPDATE categories SET name = ?, color = ? WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [
      category.name,
      category.color,
      category.id
    ]);
  }
  
  async deleteCategory(id: string) {
    await this.init();

    const query = `DELETE FROM categories WHERE id = ?`;
    await this.dbInstance?.executeSql(query, [id]);
  }
}
