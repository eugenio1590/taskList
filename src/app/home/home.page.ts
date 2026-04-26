import { Component, OnInit } from '@angular/core';
import { ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Task } from '../models/task.model';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';
import { CategoriesFilterModalComponent } from './modals/categories-filter-modal/categories-filter-modal.component';
import { CreateTaskUseCase } from '../interactor/task/create/create-task.use-case';
import { UpdateTaskUseCase } from '../interactor/task/update/update-task.use-case';
import { DeleteTaskUseCase } from '../interactor/task/delete/delete-task.use-case';
import { GetTasksUseCase } from '../interactor/task/get/get-tasks.use-case';
import { IsAddTasksWithCategoryEnabledUseCase } from '../interactor/configuration/is-add-tasks-with-category-enabled.use-case';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  newTask: string = '';
  displayTasks: Task[] = [];
  selectedCategoryId: string | null = null;
  addWithCategoryEnabled: boolean = false;

  private currentPage = 0;
  private pageSize = 20;
  public hasMoreTasks = true;

  constructor(
    private isAddTasksWithCategoryEnabled: IsAddTasksWithCategoryEnabledUseCase,
    private modalCtrl: ModalController,
    private createTask: CreateTaskUseCase,
    private updateTask: UpdateTaskUseCase,
    private deleteTask: DeleteTaskUseCase,
    private getTasks: GetTasksUseCase
  ) { }

  async ngOnInit() {
    await this.loadTasks();
    this.addWithCategoryEnabled = await this.isAddTasksWithCategoryEnabled.execute();
  }

  async loadTasks(event?: InfiniteScrollCustomEvent) {
    if (!event) {
      this.currentPage = 0;
      this.displayTasks = [];
      this.hasMoreTasks = true;
    }

    const newTasks = await this.getTasks.execute(this.currentPage, this.pageSize, this.selectedCategoryId);

    if (newTasks.length < this.pageSize) {
      this.hasMoreTasks = false;
    }

    // Filter out tasks that are already in the display list (optimistic updates)
    const filteredNewTasks = newTasks.filter(nt => !this.displayTasks.some(dt => dt.id === nt.id));
    this.displayTasks = [...this.displayTasks, ...filteredNewTasks];
    this.currentPage++;

    if (event) {
      event.target.complete();
    }
  }

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: TaskCreatorModalComponent
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const task = await this.createTask.execute(data.title, data.category);
      if (!this.selectedCategoryId || task.category?.id === this.selectedCategoryId) {
        this.displayTasks = [task, ...this.displayTasks];
      }
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

    if (role === 'confirm' && data !== this.selectedCategoryId) {
      this.selectedCategoryId = data;
      this.loadTasks();
    }
  }

  async addTask() {
    if (!this.newTask.trim()) return;

    const task = await this.createTask.execute(this.newTask, null);
    this.newTask = '';

    if (!this.selectedCategoryId) {
      this.displayTasks = [task, ...this.displayTasks];
    }
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.updateTask.execute(task);
  }

  async removeTask(task: Task) {
    await this.deleteTask.execute(task.id);
    this.displayTasks = this.displayTasks.filter(t => t.id !== task.id);
  }

  get remainingTasksCount() {
    return this.displayTasks.filter(t => !t.completed).length;
  }
}
