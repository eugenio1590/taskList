import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../models/task.model';
import { Database } from '../services/database';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  newTask: string = '';
  tasks: Task[] = [];

  constructor(
    private database: Database,
    private modalCtrl: ModalController
  ) {
  }

  async ngOnInit() {
    this.tasks = await this.database.getTasks();
  }

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: TaskCreatorModalComponent
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const task: Task = {
        id: Date.now().toString(),
        title: data.title,
        completed: false,
        category: data.category
      };

      await this.database.addTask(task);
    }

    // Always refresh tasks to ensure updated category names/colors are reflected
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
