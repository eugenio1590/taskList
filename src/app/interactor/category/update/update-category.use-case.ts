import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateCategoryUseCase {
  constructor(private database: Database) {}

  async execute(category: Category): Promise<void> {
    if (!category.name || !category.name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    return await this.database.updateCategory(category);
  }
}
