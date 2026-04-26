import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../../models/category.model';
import { GetCategoriesUseCase } from '../../../interactor/category/get/get-categories.use-case';

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
    private getCategories: GetCategoriesUseCase
  ) { }

  async ngOnInit() {
    this.categories = await this.getCategories.execute();
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
