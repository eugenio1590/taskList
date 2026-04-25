import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { Database } from '../services/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  newTask: string = '';
  tasks: Task[] = [];

  constructor(private database: Database) {
  }

  async ngOnInit() {
    this.tasks = await this.database.getTasks();
  }

  async addTask() {
    if (!this.newTask.trim()) return;

    let task: Task = {
      id: Date.now().toString(),
      title: this.newTask,
      completed: false
    }

    this.tasks.push(task);

    this.newTask = '';

    await this.database.addTask(task);
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;

    await this.database.updateTask(task);
  }

  async deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);

    await this.database.deleteTask(task.id);
  }

  get remainingTasksCount() {
    return this.tasks.filter(t => !t.completed).length;
  }
}
