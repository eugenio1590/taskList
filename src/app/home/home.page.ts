import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../models/task.model';
import { Database } from '../services/database';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';
import { CategoriesFilterModalComponent } from './modals/categories-filter-modal/categories-filter-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  newTask: string = '';
  allTasks: Task[] = [];
  displayTasks: Task[] = [];
  selectedCategoryId: string | null = null;

  constructor(
    private database: Database,
    private modalCtrl: ModalController
  ) {
  }

  async ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    this.allTasks = await this.database.getTasks();
    this.applyFilter();
  }

  applyFilter() {
    if (!this.selectedCategoryId) {
      this.displayTasks = [...this.allTasks];
    } else {
      this.displayTasks = this.allTasks.filter(t => t.category?.id === this.selectedCategoryId);
    }
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
      await this.loadTasks();
    }
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: CategoriesFilterModalComponent,
      componentProps: {
        selectedCategoryId: this.selectedCategoryId
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.selectedCategoryId = data;
      this.applyFilter();
    }
  }

  async addTask() {
    if (!this.newTask.trim()) return;

    let task: Task = {
      id: Date.now().toString(),
      title: this.newTask,
      completed: false
    }

    await this.database.addTask(task);
    this.newTask = '';
    await this.loadTasks();
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.database.updateTask(task);
  }

  async deleteTask(task: Task) {
    await this.database.deleteTask(task.id);
    await this.loadTasks();
  }

  get remainingTasksCount() {
    return this.displayTasks.filter(t => !t.completed).length;
  }
}
