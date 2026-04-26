import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../../models/category.model';
import { CategoriesPage } from 'src/app/categories/categories.page';
import { GetCategoriesUseCase } from '../../../interactor/category/get/get-categories.use-case';
import { IsAddCategoriesEnabledUseCase } from '../../../interactor/configuration/is-add-categories-enabled.use-case';

@Component({
  selector: 'app-task-creator-modal',
  templateUrl: './task-creator-modal.component.html',
  styleUrls: ['./task-creator-modal.component.scss'],
  standalone: false,
})
export class TaskCreatorModalComponent implements OnInit {
  taskTitle: string = '';
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  currentDate: string = '';
  enableAddCategories: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private isAddCategoriesEnabled: IsAddCategoriesEnabledUseCase,
    private getCategories: GetCategoriesUseCase
  ) {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async ngOnInit() {
    this.categories = await this.getCategories.execute();
    this.enableAddCategories = await this.isAddCategoriesEnabled.execute();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  async manageCategories() {
    const modal = await this.modalCtrl.create({
      component: CategoriesPage
    });

    await modal.present();

    await modal.onWillDismiss();
    this.categories = await this.getCategories.execute();

    // Re-sync selectedCategory if it was modified or deleted in the management view
    if (this.selectedCategory) {
      const updated = this.categories.find(c => c.id === this.selectedCategory?.id);
      this.selectedCategory = updated || (this.categories.length > 0 ? this.categories[0] : null);
    } else if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0];
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.taskTitle.trim() || !this.selectedCategory) {
      return;
    }

    return this.modalCtrl.dismiss({
      title: this.taskTitle,
      category: this.selectedCategory
    }, 'confirm');
  }
}
