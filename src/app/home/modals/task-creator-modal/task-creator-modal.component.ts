import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../../models/category.model';
import { Database } from '../../../services/database';

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

  constructor(
    private modalCtrl: ModalController,
    private database: Database
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
    this.categories = await this.database.getCategories();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
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
