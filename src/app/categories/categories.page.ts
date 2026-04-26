import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../models/category.model';
import { CreateCategoryUseCase } from '../interactor/category/create/create-category.use-case';
import { UpdateCategoryUseCase } from '../interactor/category/update/update-category.use-case';
import { GetCategoriesUseCase } from '../interactor/category/get/get-categories.use-case';
import { DeleteCategoryUseCase } from '../interactor/category/delete/delete-category.use-case';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  selectedColor: string = '#444444';
  editingCategory: Category | null = null;

  availableColors: string[] = [
    '#444444', '#5260ff', '#2dd36f', '#eb445a', '#ffc409', '#3dc2ff', '#92949c', '#222428'
  ];

  constructor(
    private modalCtrl: ModalController,
    private createCategory: CreateCategoryUseCase,
    private updateCategory: UpdateCategoryUseCase,
    private getCategories: GetCategoriesUseCase,
    private deleteCategory: DeleteCategoryUseCase
  ) { }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.getCategories.execute();
  }

  async saveCategory() {
    if (!this.newCategoryName.trim()) return;

    if (this.editingCategory) {
      // Update existing
      const updatedCategory: Category = {
        ...this.editingCategory,
        name: this.newCategoryName,
        color: this.selectedColor
      };
      await this.updateCategory.execute(updatedCategory);
      this.editingCategory = null;
    } else {
      // Add new
      await this.createCategory.execute(this.newCategoryName, this.selectedColor);
    }

    this.newCategoryName = '';
    this.selectedColor = '#444444';
    await this.loadCategories();
  }

  startEdit(category: Category) {
    this.editingCategory = category;
    this.newCategoryName = category.name;
    this.selectedColor = category.color;
  }

  cancelEdit() {
    this.editingCategory = null;
    this.newCategoryName = '';
    this.selectedColor = '#444444';
  }

  async removeCategory(id: string) {
    await this.deleteCategory.execute(id);
    if (this.editingCategory?.id === id) {
      this.cancelEdit();
    }
    await this.loadCategories();
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }
}
