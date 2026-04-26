import { Injectable } from '@angular/core';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateCategoryUseCase {
  constructor(private repository: CategoryRepository) {}

  async execute(category: Category): Promise<void> {
    if (!category.name || !category.name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    return await this.repository.updateCategory(category);
  }
}
