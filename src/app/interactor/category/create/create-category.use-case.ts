import { Injectable } from '@angular/core';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CreateCategoryUseCase {
  constructor(private repository: CategoryRepository) {}

  async execute(name: string, color: string): Promise<void> {
    if (!name || !name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color
    };

    return await this.repository.addCategory(newCategory);
  }
}
