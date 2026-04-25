import { Component } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  newTask: string = '';
  tasks: Task[];

  constructor() {
    this.tasks = [
      { id: '1', title: 'This is an example of a task #1', completed: false },
      { id: '2', title: 'This is an example of a task #2', completed: true }
    ];
  }

  addTask() {
    if (!this.newTask.trim()) return;

    this.tasks.push({
      id: Date.now().toString(),
      title: this.newTask,
      completed: false
    });

    this.newTask = '';
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  get remainingTasksCount() {
    return this.tasks.filter(t => !t.completed).length;
  }
}
