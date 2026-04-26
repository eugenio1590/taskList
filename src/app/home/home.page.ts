import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../models/task.model';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';
import { CategoriesFilterModalComponent } from './modals/categories-filter-modal/categories-filter-modal.component';
import { ConfigurationRepository } from '../repositories/configuration.repository';
import { CreateTaskUseCase } from '../interactor/task/create/create-task.use-case';
import { UpdateTaskUseCase } from '../interactor/task/update/update-task.use-case';
import { DeleteTaskUseCase } from '../interactor/task/delete/delete-task.use-case';
import { GetTasksUseCase } from '../interactor/task/get/get-tasks.use-case';

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
  addWithCategoryEnabled: boolean = false;

  constructor(
    private configRepository: ConfigurationRepository,
    private modalCtrl: ModalController,
    private createTask: CreateTaskUseCase,
    private updateTask: UpdateTaskUseCase,
    private deleteTask: DeleteTaskUseCase,
    private getTasks: GetTasksUseCase
  ) { }

  async ngOnInit() {
    await this.loadTasks();

    try {
      this.addWithCategoryEnabled = await this.configRepository.getBoolean('add_tasks_with_category');
    } catch(e) {
      console.error('Error fetching remote config', e);
      this.addWithCategoryEnabled = false; // Default
    }
  }

  async loadTasks() {
    this.allTasks = await this.getTasks.execute();
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
      await this.createTask.execute(data.title, data.category);
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

    await this.createTask.execute(this.newTask, null);
    this.newTask = '';
    await this.loadTasks();
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.updateTask.execute(task);
  }

  async removeTask(task: Task) {
    await this.deleteTask.execute(task.id);
    await this.loadTasks();
  }

  get remainingTasksCount() {
    return this.displayTasks.filter(t => !t.completed).length;
  }
}
