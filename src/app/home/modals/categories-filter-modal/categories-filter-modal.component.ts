import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../../models/category.model';
import { Database } from '../../../services/database';

@Component({
  selector: 'app-categories-filter-modal',
  templateUrl: './categories-filter-modal.component.html',
  styleUrls: ['./categories-filter-modal.component.scss'],
  standalone: false
})
export class CategoriesFilterModalComponent implements OnInit {
  @Input() selectedCategoryId: string | null = null;
  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private database: Database
  ) { }

  async ngOnInit() {
    this.categories = await this.database.getCategories();
  }

  selectCategory(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  apply() {
    return this.modalCtrl.dismiss(this.selectedCategoryId, 'confirm');
  }
}
