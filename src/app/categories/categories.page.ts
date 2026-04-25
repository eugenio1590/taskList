import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../models/category.model';
import { Database } from '../services/database';

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
    private database: Database,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.database.getCategories();
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
      await this.database.updateCategory(updatedCategory);
      this.editingCategory = null;
    } else {
      // Add new
      const newCategory: Category = {
        id: Date.now().toString(),
        name: this.newCategoryName,
        color: this.selectedColor
      };
      await this.database.addCategory(newCategory);
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

  async deleteCategory(id: string) {
    await this.database.deleteCategory(id);
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
