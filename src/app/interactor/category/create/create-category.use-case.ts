import { Injectable } from '@angular/core';
import { Database } from '../../../services/database';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CreateCategoryUseCase {
  constructor(private database: Database) {}

  async execute(name: string, color: string): Promise<void> {
    if (!name || !name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: name.trim(),
      color: color
    };

    return await this.database.addCategory(newCategory);
  }
}
